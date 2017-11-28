const { writeFile } = require('fs')
const { promisify } = require('util')
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1')
const { watsonUser, watsonPass } = require('./keys')
const Storage = require('@google-cloud/storage')
const writeFilePromise = promisify(writeFile)

const textToSpeech = new TextToSpeechV1({
  username: watsonUser,
  password: watsonPass,
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
})

function speechStorage() {
  const storage = new Storage()
  return storage
    .bucket(`summary-73ccc.appspot.com`)
    .upload(`Testing.mp3`)
    .then(_ => console.log('uploaded file to cloud storage'))
    .catch(console.error.bind(console))
}

function speechCreation() {
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
    accept: 'audio/mp3',
  }
  // Pipe the synthesized text to a file.
  textToSpeech.synthesize(params, (err, audio) => {
    if (err) {
      console.log(err)
      return
    }
    writeFilePromise('Testing.mp3', audio)
      .then(() => {
        console.log('Audio file genereated!')
      })
      .then(() => speechStorage())
      .then(() => console.log('file upload complete!'))
      .catch(console.error)
  })
}

speechCreation()
