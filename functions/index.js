const functions = require('firebase-functions')
const Storage = require('@google-cloud/storage')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const sendgrid = require('sendgrid')
const client = sendgrid('YOUR_SG_API_KEY')
const axios = require('axios')
const Promise = require('bluebird')
const zipcodes = require('zipcodes')
const DarkSkyApi = require('dark-sky-api')

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

exports.httpEmail = functions.https.onRequest((req, res) => {
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
    })
})

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from summaries.io, where your we summarize your news while you sleep!')
})

const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1')
// const text_to_speech = new TextToSpeechV1({
//   username: process.env.REACT_APP_watsonUsername,
//   password: process.env.REACT_APP_watsonPassword,
// })
const fs = require('fs')

exports.speech = functions.https.onRequest((req, res) => {
  //set current date
  const date = dateMaker()
  // const newsUrl = `https://newsapi.org/v2/top-headlines?sources=${newsSource}&apiKey=${newsKey}`

  //initialize google cloud storage instance
  // const storage = new Storage()

  admin
    .firestore()
    .collection(`sources/bloomberg/days/${date}/articles`)
    .get()
    .then(querySnapshot => {
      const summaries = querySnapshot.docs.map(doc => {
        return {
          summary: doc.data().summary,
          title: doc.data().title.replace(/\'+/g, ''),
        }
      })
      console.log(summaries)
      return summaries
    })
    // .then(summaries => {
    //   summaries.forEach(summary => {
    //     const params = {
    //       text: summary.summary,
    //       voice: 'en-US_AllisonVoice',
    //       accept: 'audio/mp3',
    //     }

    //     // Pipe the synthesized text to a file.
    //     text_to_speech
    //       .synthesize(params)
    //       .on('error', function(error) {
    //         console.log('Error:', error)
    //       })
    //       .pipe(fs.createWriteStream(`/audio/${summary.title}.mp3`))
    //   })
    //   return summaries
    // })
    // .then(summaries => {
    //   const storage = new Storage()
    //   summaries.forEach(summary => {
    //     storage
    //       .bucket(`summary-73ccc.appspot.com`)
    //       .upload(
    //         `/Users/Mueed-1/Desktop/capstone/summaries.io/functions/audio/${summary.title}.mp3`,
    //       )
    //       .then(_ => console.log('uploaded file'))
    //       .catch(console.error.bind(console))
    //   })
    // })
    // for (let i = 0; i < summaries.length; i++) {
    //   const params = {
    //     Text: summaries[i].summary,
    //     OutputFormat: 'mp3',
    //     VoiceId: 'Joanna',
    //   }

    // (err, data) => {
    //   console.log(params)
    //   if (err) console.error(err.stack)
    //   else if (data) {
    //     if (data.AudioStream instanceof Buffer) {
    //       try {
    //         fs.writeFileSync(`./audio/${summaries[i].title}.mp3`, data.AudioStream)
    //         console.log(`${summaries[i].title} FILE SAVED`)
    //       } catch (error) {
    //         console.log('could not write all the files', error)
    //       }
    //     }
    //   }
    // },
    // )

    // await storage
    //   .bucket(`summary-73ccc.appspot.com`)
    //   .upload(
    //     `/Users/Mueed-1/Desktop/capstone/summaries.io/functions/audio/${
    //       summaries[i].title
    //     }.mp3`,
    //   )
    //   .then(_ => console.log('uploaded file'))
    //   .catch(console.error.bind(console))
    // }
    // })
    // .then(summaries => console.log(summaries))
    .then(_ => res.sendStatus(200))
    .catch(console.error.bind(console))
})

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

  var Forecast = require('forecast')

  // Initialize
  var forecast = new Forecast({
    service: 'darksky',
    key: weatherKey,
    units: 'fahrenheit',
  })

  // Gett all zipcodes from database
  const zipsArray = ['08536', '10001', '08648', '08807']

  const locations = zipsArray.map(zip => zipcodes.lookup(zip))

  // Write each location to db
  Promise.each(locations, writeWeather).then(() => {
    response.json('Writing to DB, check logs')
  })

  function writeWeather(location) {
    const fora = forecast.get([location.latitude, location.longitude], function(err, weather) {
      if (err) return console.dir(err)
      // console.log(weather.daily.data[0]);

      const date = dateMaker()

      return admin
        .firestore()
        .collection('weather')
        .doc('days')
        .collection(date)
        .doc('zip')
        .collection(location.zip)
        .doc('forecast')
        .set(weather.daily)
        .then(succ => {
          console.log('wrote weather for', location.zip)
        })
        .catch(console.error.bind(console))
    })
  }
})
