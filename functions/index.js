const functions = require('firebase-functions')
const Storage = require('@google-cloud/storage')


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const sendgrid = require('sendgrid')
const client = sendgrid('YOUR_SG_API_KEY')
const axios = require('axios')
const Promise = require('bluebird')

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
        body: parseBody(req.body)
      })

      return client.API(request)
    })
    .then(response => (response.body ? res.send(response.body) : res.end()))
    .catch(err => {
      console.error(err)
      return Promise.reject(err)
    })
)


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send(
    'Hello from summaries.io, where your we summarize your news while you sleep!'
  )
})

//Polly requirements
const AWS = require('aws-sdk')
const fs = require('fs')
const credentials = new AWS.Credentials(
  process.env.REACT_APP_awsKey,
  process.env.REACT_APP_awsSecret
)

exports.polly = functions.https.onRequest((req, res) => {
  const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
  })

  //set current date
  const date = dateMaker()
  // const newsUrl = `https://newsapi.org/v2/top-headlines?sources=${newsSource}&apiKey=${newsKey}`

  //initialize google cloud storage instance
  const storage = new Storage()

  return admin
    .firestore()
    .collection(`sources/bloomberg/days/${date}/articles`)
    .get()
    .then(async querySnapshot =>
      querySnapshot.forEach(async doc => {
        const params = {
          Text: doc.data().title,
          OutputFormat: 'mp3',
          VoiceId: 'Joanna'
        }
        const title = doc
          .data()
          .title.replace(/\'+/, '')
          .replace(/\s+/, '-')
        console.log(title)

        /*Regex to rewrite file with title of article without apostraphes and spaces
          audio file will be in form of buffer from AWS Polly
          file will have individual name of article title
        */

        await Polly.synthesizeSpeech(params, async (err, data) => {
          const title = params.Text.replace(/\'+/, '').replace(/\s+/, '-')
          if (err) console.error(err.stack)
          else if (data) {
            if (data.AudioStream instanceof Buffer) {
              await fs.writeFile(
                `./audio/${title}.mp3`,
                data.AudioStream,
                err => {
                  if (err) return console.error(err)
                  console.log('The file was saved!')
                }
              )
            }
          }
        })

        /*Adding to google cloud storage.
          bucket requires the bucket name
          upload requires local file path
        */

        await storage
          .bucket(`summary-73ccc.appspot.com`)
          .upload(
            `/Users/Mueed-1/Desktop/capstone/summaries.io/functions/audio/${title}.mp3`
          )
          .then(_ => console.log('uploaded file'))
          .catch(console.error)
        return true
      })
    )
    .then(data => res.json(data))
    .catch(console.error)
})

exports.makeSummaries = functions.https.onRequest((request, response) => {
  const { newsKey, sumKey } = require('./keys')
exports.makeSummaries1 = functions.https.onRequest((request, response) => {
  const { newsKey, sumKey } = require("./keys");
exports.makeSummaries = functions.https.onRequest((request, response) => {
  const { newsKey, sumKey } = require('./keys');
  let count = 1;

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
  ];

  let articles = [];

  // What is today's date?
  const date = dateMaker();
  Promise.mapSeries(newsSources, makeSum)
    .then(() => {
      response.json('Done')
    })
    .catch(console.error('error on a source'));

  function makeSum(source) {
    Promise.mapSeries([source], getSource)
      .then(result => {
        Promise.mapSeries(result, writeSource)
          .catch((err) => {
            console.error('Error writing to the database on', source, err.message)
          })
      })
      .catch((err) => {
        console.log('Error getting sources')
        response.json('Atleast one error, check logs for more info')
      })


    // Function definition to getSource
    function getSource(newsSource) {
      const newsUrl = `https://newsapi.org/v2/top-headlines?sources=${newsSource}&apiKey=${newsKey}`

      return axios.get(newsUrl)
        .then(response => {
          articles = response.data.articles.map(async article => {

            // Defaults to description
            article.summary = article.description

            const sumsObj = await axios
              .get(`http://api.smmry.com/&SM_API_KEY=${sumKey}&&SM_LENGTH=2&SM_URL=${article.url}`)
              .catch((err) => {
                console.error('Error with smmry on', article.url)
              })

            let updatedArticle;

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
        .catch((err) => {
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
      .collection("sources")
      .doc(newsSource)
      .collection("days")
      .doc(date)
      .collection("articles")

    data.forEach(article => {
      batch.set(dayRef.doc(article.title), { ...article })
    });

    batch
      .commit()
      .then(() => {
        console.log("added " + articles.length + " from " + newsSource + " to Firestore",
          'source number ' + count++ + '/40')
      })
      .catch(() => {
        console.log("ERROR: Failed to write", articles.length, "from", newsSource, "to Firestore")
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
    .then(function (users) {
      const batch = admin.firestore().batch()
      users.forEach(function (user) {
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
                      { ...articleContent }
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
