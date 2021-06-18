const express = require('express'),
  bodyParser = require('body-parser'),
  scripts = require('./script')
const app = express()
const port = process.env.PORT || 3000 

let interval = null, t = 0, partCount = 0

// We are middleware - JBG
// I handle serving static pages - JBG
app.use(express.static('public'))

// We process POST body data - JBG
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))

// I handle GET requests - JBG
app.get('/instruct', (req, res) => {
  let groupId = req.query.groupId

  console.log(`Request for group ${groupId}`)

  if(!groupId) {
    ++partCount
    groupId = partCount % scripts.length
  }

  let time = 0
  let obj = null 
  
  scripts[groupId].forEach((s, i) => {
    time += s.time
    if(!obj && t < time) obj = s
  })

  if(!obj) obj = scripts[groupId][scripts[groupId].length - 1]

  res.send(JSON.stringify({ ...obj, groupId }))

})

function stop() {
  if(interval) {
    clearInterval(interval)
    t = 0
  }
}

function start() {
  interval = setInterval(() => {
    t += 1
    console.log(`time: ${t}`)
  }, 1000)
}

app.get('/start', (req, res) => {
  stop()
  start()
  res.send('Script is started 🏃🏻‍♀️')
})

app.get('/stop', (req, res) => {
  stop()
  res.send('Stopped script 🛑')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

