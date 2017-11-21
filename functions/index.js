const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const sendgrid = require('sendgrid')
const client = sendgrid('YOUR_SG_API_KEY')

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

import AWS from 'aws-sdk'
import fs from 'fs'
const credentials = new AWS.Credentials(
  process.env.REACT_APP_awsKey,
  process.env.REACT_APP_awsSecret
)

const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
})

let params = {
  Text: `Testing this text, and that was a comma
    Mr. Adrien so we can hear how the pauses work`,
  OutputFormat: 'mp3',
  VoiceId: 'Joanna'
}

exports.polly = functions.https.onRequest((req, res) => {
  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) console.err(err.stack)
    else if (data) {
      if (data.AudioStream instanceof Buffer) {
        fs.writeFile('./speech.mp3', data.AudioStream, err => {
          if (err) return console.err(err)
          console.log('The file was saved!')
        })
      }
    }
  })
})
