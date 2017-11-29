const functions = require('firebase-functions')
const Storage = require('@google-cloud/storage')
const axios = require('axios')
const Promise = require('bluebird')
const zipcodes = require('zipcodes')
const nodemailer = require('nodemailer')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

function dateMaker() {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

exports.userEmail = functions.https.onRequest((req, res) => {
  // Here we decide which users we notify
  // sendEmail('verblodung@gmail.com')

  admin
    .firestore()
    .collection('users')
    // Here add a where query to filter by requested time
    .get()
    .then(function(users) {
      users.forEach(function(user) {
        console.log('user.id', user.id)
        makeEmail(user.id)
      })
    })
    .then(() => res.send('hello summaries.io'))
})

function makeEmail(user) {
  let userSource = []
  admin
    .firestore()
    .collection('users')
    .doc(user)
    .collection('emails')
    .doc(dateMaker())
    .get()
    .then(doc => {
      userSource = Object.keys(doc.data())
    })
    .then(() => {
      const promises = userSource.map(async source => {
        const articles = await admin
          .firestore()
          .collection('users')
          .doc(user)
          .collection('emails')
          .doc(dateMaker())
          .collection(source)
          .get()
          .then(snapshot => {
            const artFromSource = []
            snapshot.forEach(doc => {
              artFromSource.push(doc.data())
            })
            return artFromSource
          })

        return { [source]: articles }
      })

      return Promise.all(promises).then(articleObjects => Object.assign({}, ...articleObjects))
    })
    .then(arr => {
      const allSources = Object.keys(arr).map(key => {
        const header = `<h2 style="margin-top: 1.5em;">${arr[key][0].source.name}</h2>`
        const content = arr[key]
          .map(
            article =>
              `<div style="border-radius: 20px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); width: 80vw; padding: 1.5em; margin-bottom: 1em;"><a href=${
                article.url
              } style="font-size: 1.2em;">${article.title}</a>
              <p style="font-size: 1em;">${article.summary}</p></div>`
          )
          .join('')
        const body = header + content
        return body
      })
      const logo = `<div style="text-align: center;"><img src="https://i.imgur.com/RgjJeBb.png" alt="email-logo" style="width: 50vw; height: auto;"></div>`

      const welcome = '<h2 style="font-size: 1.8em;">Welcome to your daily summary</h2>'

      const html =
        '<html>' +
        logo +
        welcome +
        '<div style="line-height: 1.5em;">' +
        allSources.join('') +
        '</div></html>'
      return html
    })
    .then(html => {
      return sendEmail(user, html)
    })
}

function sendEmail(user, html) {
  const { gmail } = require('./keys')
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'summariesio@gmail.com',
      pass: gmail
    }
  })

  const mailOptions = {
    from: '⚡ summaries.io ⚡ <your@summaries.io>',
    to: user,
    subject: 'Your daily summaries',
    html: html
  }

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) return err
    else return info
  })
}

// const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1')
// const { watsonUser, watsonPass } = require('./keys')
// const textToSpeech = new TextToSpeechV1({
//   username: watsonUser,
//   password: watsonPass,
//   url: 'https://stream.watsonplatform.net/text-to-speech/api'
// })

exports.speech = functions.https.onRequest((req, res) => {
  console.log('Running speach creation...')
  const params = {
    text: `There are many variations of passages of Lorem Ipsum available,
      but the majority have suffered alteration in some form, by injected humour,
      or randomised words which don't look even slightly believable. If you are going to use a passage of
      Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
      All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary,
      making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,
      combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
      The generated Lorem Ipsum is therefore always free from repetition, injected humour,
      or non-characteristic words etc.`,
    voice: 'en-US_AllisonVoice',
    accept: 'audio/mp3'
  }
  // Pipe the synthesized text to a file.
  const storage = new Storage()
  const newAudioFile = storage.bucket(`summary-73ccc.appspot.com`).file(`StreamTest.mp3`)
  const audioStream = newAudioFile.createWriteStream()

  textToSpeech
    .synthesize(params)
    .on('error', err => console.error(err))
    .pipe(audioStream)

  console.log('Stream complete!')
  res.sendStatus(200)
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
    'wired'
  ]

  let articles = []

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
        console.log('Error getting sources', err)
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
                if (err) console.error('Error with smmry on', article.url)
              })

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
          if (err) console.error('error on', newsSource, 'err:', err)
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
          'source number ' + count++ + '/40'
        )
      })
      .catch(() => {
        console.log('ERROR: Failed to write', articles.length, 'from', newsSource, 'to Firestore')
      })
  }
})

exports.makeEmails = functions.https.onRequest((request, response) => {
  const today = dateMaker()

  admin
    .firestore()
    .collection('users')
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
            subscriptions.forEach(subscription => {
              const sub = subscription.id
              batch.set(
                admin
                  .firestore()
                  .collection('users')
                  .doc(user.id)
                  .collection('emails')
                  .doc(today),
                { [sub]: true },
                { merge: true }
              )
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
                    batch.set(
                      admin
                        .firestore()
                        .collection('users')
                        .doc(user.id)
                        .collection('emails')
                        .doc(today)
                        .collection(subscription.id)
                        .doc(article.id),
                      { ...articleContent }
                    )
                  })
                })
                .then(() => {
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
  const Forecast = require('forecast')

  const forecast = new Forecast({
    service: 'darksky',
    key: weatherKey,
    units: 'fahrenheit'
  })

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
      const locations = []
      zipCodes.forEach(zip => {
        const location = zipcodes.lookup(zip)
        if (location) locations.push(location)
      })

      // Write each location to db
      Promise.each(locations, writeWeather)
        .then(() => {
          response.json('Writing to DB, check logs')
        })
        .catch(console.error)
    })

  function writeWeather(location) {
    forecast.get([location.latitude, location.longitude], function(err, weather) {
      if (err) return console.dir(err)

      const date = dateMaker()
      return admin
        .firestore()
        .collection('weather')
        .doc('days')
        .collection(date)
        .doc('zip')
        .collection(location.zip)
        .doc('forecast')
        .set(weather.daily.data[0])
        .then(() => {
          console.log('wrote weather for', location.zip)
        })
        .catch(console.error.bind(console))
    })
  }
})
