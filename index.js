const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/url_shortened')
const app = express()
require('dotenv').config()
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.set(express.json())
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.full_url })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(5000,console.log(`Server running at 5000`))
