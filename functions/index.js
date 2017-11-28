const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const sendgrid = require('sendgrid')
const client = sendgrid('YOUR_SG_API_KEY')
const axios = require('axios')
const Promise = require('bluebird')
const zipcodes = require('zipcodes')


const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

function dateMaker() {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function parseBody(body) {
  const helper = sendgrid.mail
  const fromEmail = new helper.Email(body.from)
  const toEmail = new helper.Email(body.to)
  const subject = body.subject
  const content = new helper.Content('text/html', body.content)
  const mail = new helper.Mail(fromEmail, subject, toEmail, content)
  return mail.toJSON()
}

exports.httpEmail = functions.https.onRequest((req, res) =>
  Promise.resolve()
    .then(_ => {
      if (req.method !== 'POST') {
        const error = new Error('Only POST requests are accepted')
        error.code = 405
        throw error
      }

      const request = client.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: parseBody(req.body),
      })

      return client.API(request)
    })
    .then(response => (response.body ? res.send(response.body) : res.end()))
    .catch(err => {
      console.error(err)
      return Promise.reject(err)
    }),
)

exports.makeSummaries = functions.https.onRequest((request, response) => {
  const { newsKey, sumKey } = require('./keys')
  let count = 1

  // First we retrieve the list of sources
  const newsSources = [
    'abc-news',
    'al-jazeera-english',
    'ars-technica',
    'associated-press',
    'axios',
    'espn',
    'bleacher-report',
    'bloomberg',
    'business-insider',
    'buzzfeed',
    'cbs-news',
    'cnbc',
    'cnn',
    'crypto-coins-news',
    'engadget',
    'entertainment-weekly',
    'espn',
    'fortune',
    'hacker-news',
    'ign',
    'mashable',
    'msnbc',
    'national-geographic',
    'nbc-news',
    'nfl-news',
    'nhl-news',
    'politico',
    'polygon',
    'reuters',
    'techcrunch',
    'the-hill',
    'the-huffington-post',
    'the-new-york-times',
    'the-verge',
    'the-wall-street-journal',
    'the-washington-post',
    'time',
    'usa-today',
    'vice-news',
    'wired',
  ]

  let articles = []

  // What is today's date?
  const date = dateMaker()
  Promise.mapSeries(newsSources, makeSum)
    .then(() => {
      response.json('Done')
    })
    .catch(console.error('error on a source'))

  function makeSum(source) {
    Promise.mapSeries([source], getSource)
      .then(result => {
        Promise.mapSeries(result, writeSource).catch(err => {
          console.error('Error writing to the database on', source, err.message)
        })
      })
      .catch(err => {
        console.log('Error getting sources')
        response.json('Atleast one error, check logs for more info')
      })

    // Function definition to getSource
    function getSource(newsSource) {
      const newsUrl = `https://newsapi.org/v2/top-headlines?sources=${newsSource}&apiKey=${newsKey}`

      return axios
        .get(newsUrl)
        .then(response => {
          articles = response.data.articles.map(async article => {
            // Defaults to description
            article.summary = article.description

            const sumsObj = await axios
              .get(`http://api.smmry.com/&SM_API_KEY=${sumKey}&&SM_LENGTH=2&SM_URL=${article.url}`)
              .catch(err => {
                console.error('Error with smmry on', article.url)
              })

            let updatedArticle

            // Check to see if article summarized successfully
            if (sumsObj && sumsObj.data.sm_api_content) {
              console.log('Summary success')
              // Article summary success, overwrite description
              article.summary = sumsObj.data.sm_api_content
            }

            return article
          })
          return Promise.all(response.data.articles)
        })
        .catch(err => {
          console.error('error on', newsSource)
        })
    }
  }

  // Write source to the database
  function writeSource(data) {
    const newsSource = data[0].source.id
    const batch = admin.firestore().batch()
    const dayRef = admin
      .firestore()
      .collection('sources')
      .doc(newsSource)
      .collection('days')
      .doc(date)
      .collection('articles')

    data.forEach(article => {
      batch.set(dayRef.doc(article.title), { ...article })
    })

    batch
      .commit()
      .then(() => {
        console.log(
          'added ' + articles.length + ' from ' + newsSource + ' to Firestore',
          'source number ' + count++ + '/40',
        )
      })
      .catch(() => {
        console.log('ERROR: Failed to write', articles.length, 'from', newsSource, 'to Firestore')
      })
  }
})

exports.makeEmails = functions.https.onRequest((request, response) => {
  const today = dateMaker()

  const rec = admin
    .firestore()
    .collection('users')
    // Here add a where query to filter by requested time
    .get()
    .then(function(users) {
      const batch = admin.firestore().batch()
      users.forEach(function(user) {
        admin
          .firestore()
          .collection('users')
          .doc(user.id)
          .collection('subscriptions')
          .get()
          .then(subscriptions => {
            return subscriptions.forEach(subscription => {
              console.log(subscription.id, today)
              admin
                .firestore()
                .collection('sources')
                .doc(subscription.id)
                .collection('days')
                .doc(today)
                .collection('articles')
                .get()
                .then(articles => {
                  articles.forEach(article => {
                    const articleContent = article.data()
                    console.log('batch add')
                    batch.set(
                      admin
                        .firestore()
                        .collection('users')
                        .doc(user.id)
                        .collection('emails')
                        .doc(today)
                        .collection(subscription.id)
                        .doc(article.id),
                      { ...articleContent },
                    )
                  })
                })
                .then(res => {
                  batch
                    .commit()
                    .then(console.log)
                    .catch(console.error)
                })
                .catch(console.error)
            })
          })
          .catch(console.error)
      })
    })
    .catch(console.error)
  response.send('emails are being created')
})

exports.getWeather = functions.https.onRequest((request, response) => {
  const { weatherKey } = require('./keys')

  // Initialize
  const Forecast = require('forecast');

  const forecast = new Forecast({
    service: 'darksky',
    key: weatherKey,
    units: 'fahrenheit'
  });

  // Get users from db
  admin
    .firestore()
    .collection('users')
    .get()
    .then(users => {

      // get all zipCodes from the users in a set to avoid duplicates
      const zipCodesSet = new Set()

      users.forEach(user => {
        zipCodesSet.add(user.data().zip)
      })

      //convert set to an array
      const zipCodes = Array.from(zipCodesSet)

      // Get locations array of object location
      const locations = zipCodes.map(zip => zipcodes.lookup(zip))

       // Write each location to db
      Promise.each(locations, writeWeather)
        .then(() => {
          response.json('Writing to DB, check logs')
        })
    })


function writeWeather(location) {
    forecast.get([location.latitude, location.longitude], function (err, weather) {
      if (err) return console.dir(err);

      const date = dateMaker();
      return admin
        .firestore()
        .collection('weather')
        .doc('days')
        .collection(date)
        .doc('zip')
        .collection(location.zip)
        .doc('forecast')
        .set(weather.daily.data[0])
        .then((succ) => {
          console.log('wrote weather for', location.zip)
        })
        .catch(console.error.bind(console))
    })
  }


})
