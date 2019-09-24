var path = require('path')
var config = require('./config.json')
var express = require('express')
var session = require('express-session')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded()) // required to pass form data to POST request//
app.use(session({secret: 'secret', resave: 'false', saveUninitialized: 'false'}))

// Initial view - loads Connect To QuickBooks Button
app.get('/', function (req, res) {
  res.render('home', config)
})

app.use('/connect_to_quickbooks', require('./routes/connect_to_quickbooks.js'))
app.use('/connect_handler', require('./routes/connect_handler.js'))

// Callback - called via redirect_uri after authorization
app.use('/callback', require('./routes/callback.js'))

// Connected - call OpenID and render connected view
app.use('/connected', require('./routes/connected.js'))

// Call an example API over OAuth2
app.use('/api_call', require('./routes/api_call.js'))

// POST the form data to this endpoint
app.post('/api_call/accounts', (req, res) => {
  const query = req.body.query
  const url = 'https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365015365860/query?minorversion=40'
  res.send (url)
  res.end()
})

app.post('/submit-form', (req, res) => {
  const query = req.body.query

  res.end()
})

// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
