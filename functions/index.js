const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// const sendgrid = require('sendgrid')
// const client = sendgrid('YOUR_SG_API_KEY')

// function parseBody(body) {
//   const helper = sendgrid.mail
//   const fromEmail = new helper.Email(body.from)
//   const toEmail = new helper.Email(body.to)
//   const subject = body.subject
//   const content = new helper.Content('text/html', body.content)
//   const mail = new helper.Mail(fromEmail, subject, toEmail, content)
//   return mail.toJSON()
// }

// exports.httpEmail = functions.https.onRequest((req, res) =>
//   Promise.resolve()
//     .then(_ => {
//       if (req.method !== 'POST') {
//         const error = new Error('Only POST requests are accepted')
//         error.code = 405
//         throw error
//       }

//       const request = client.emptyRequest({
//         method: 'POST',
//         path: '/v3/mail/send',
//         body: parseBody(req.body)
//       })

//       return client.API(request)
//     })
//     .then(response => (response.body ? res.send(response.body) : res.end()))
//     .catch(err => {
//       console.error(err)
//       return Promise.reject(err)
//     })
// )
