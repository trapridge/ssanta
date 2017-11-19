import R from 'ramda'
import Mailgun from 'mailgun-js'
import { drawUntilSuccess } from './drawMachine'

const getSuggestion = () => {
  const suggestions = [
    'a set of dark colored socks',
    'a big box of artisan raw chocolate (w/o sugar)',
    'an ant farm',
    'a cubistic painting',
    'a capybara puppy',
    'a pair of chemical hand warmers',
    'a fleece robe',
    'a funny hat',
    'a raindeer sweater',
    'an ornament',
    'a non-fiction book',
  ]
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

const getHtmlEmail = (giverName, receiverName, suggestion) => `
  <div>
    <img src="https://i.giphy.com/media/K90ckojkohXfW/giphy.gif">
    <br>
    <strong>Hohoho ${giverName}!</strong>
    <p>This Xmas you will buy a present for ${receiverName}.</p>
    <p>Maybe you should consider purchasing ${suggestion}? I've heard it's a popular gift this year.</p>
    <p>Happy holidays!<br>Santa</p>
  </div>
`

const send = (mg, giver) => {
  return new Promise((resolve, reject) => {
    mg.messages().send({
      from: 'Secret Santa <santa@claus.org>',
      to: giver.email,
      subject: 'Xmas presents',
      html: getHtmlEmail(giver.name, giver.receiver.name, getSuggestion())
    }, (err, body) => {
      if (err) reject(err)
      else resolve(body)
    })
  })
}

const getPool = () => [
  { name: 'Person1', email: 'person1@mail.invalid', picked: false, blacklist: ['person2@mail.invalid'] },
  { name: 'Person2', email: 'person2@mail.invalid', picked: false, blacklist: ['person1@mail.invalid'] },
  { name: 'Person3', email: 'person3@mail.invalid', picked: false, blacklist: [] },
  { name: 'Person4', email: 'person4@mail.invalid', picked: false, blacklist: [] },
]

const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_SERVER_NAME

if (!apiKey || !domain) {
  console.log('Aborting. Set up Mailgun env vars: MAILGUN_API_KEY, MAILGUN_SERVER_NAME')
  process.exit(1)
}

const mg = new Mailgun({ apiKey, domain })

let sent
try {
  sent = Promise.all(drawUntilSuccess(getPool).map(giver => send(mg, giver)))
} catch (e) {
  console.log('Problem in sending emails')
  throw e
}
