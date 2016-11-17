import R from 'ramda'
import Mailgun from 'mailgun-js'

const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_SERVER_NAME

if (!apiKey || !domain) {
  console.log('Aborting. Set up Mailgun env vars: MAILGUN_API_KEY, MAILGUN_SERVER_NAME')
  process.exit(1)
}

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
    'a nonfiction book',
  ]
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}
const mg = new Mailgun({ apiKey, domain })
const presentEmailPromises =
  // ramdomize array of participants
  R.sort(() => Math.random() - 0.5, [
    { name: 'Person1', email: 'person1@email.invalid' },
    { name: 'Person2', email: 'person2@email.invalid' },
    { name: 'Person3', email: 'person3@email.invalid' },
  ])
  // create list of buyer/receiver mappings in cyclic linked list manner
  .reduce((acc, v, i, arr) => {
    return [...acc, {
      buyerName: v.name,
      buyerEmail: v.email,
      receiverName: i === arr.length - 1 ? arr[0].name : arr[i + 1].name
    }]
  }, [])
  // send emails
  .map((mapping) => {
    return new Promise((resolve, reject) => {
      mg.messages().send({
        from: 'Secret Santa <santa@claus.org>',
        to: mapping.buyerEmail,
        subject: 'Xmas presents',
        text:
`Hohoho ${mapping.buyerName}!
  
This Xmas you will buy a present for ${mapping.receiverName}. 

Maybe you should consider purchasing ${getSuggestion()}? I've heard it's a popular gift this year.

Happy holidays!
Santa`
      }, (err, body) => {
        if (err) reject(err)
        else resolve(body)
      })
    })
  })

Promise
  .all(presentEmailPromises)
  .then((body) => console.log('emails sent', body))
  .catch(err => console.log(err))
