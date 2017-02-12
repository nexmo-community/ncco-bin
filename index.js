const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Store = require('./store');
const store = new Store();

require('dotenv').config();

const BIN_PHONE_NUMBER = process.env.BIN_PHONE_NUMBER;
const BIN_BASE_URL = process.env.BIN_BASE_URL;
const NCCO_TEMPLACE = `[
  {
    "action": "talk",
    "text": "Welcome to a Nexmo conference call via N C C O bin."
  },
  {
    "action": "conversation",
    "name": "nexmo-conference"
  }
]`;

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', (req, res) => {
  var nextBin = store.create(NCCO_TEMPLACE);
  res.redirect(`/bins/${nextBin.id}`);
});

app.get('/bins/:binId', (req, res) => {
  var bin = store.read(req.params.binId);
  if(!bin) {
    return res.redirect('/');
  }
  
  if(req.get('Content-Type') === 'application/json') {
    const ncco = JSON.parse(bin.ncco.replace('\n', ''));
    res.json(ncco);
  }
  else {
    const binUrl = `${BIN_BASE_URL}/bins/${bin.id}`;
    res.render('pages/index', {
      bin: bin,
      nccoBinPhoneNumber: BIN_PHONE_NUMBER,
      binUrl: binUrl
    });  
  }
});

app.post('/bins', (req, res) => {
  let bin = {
    id: req.body.id,
    ncco: req.body.ncco
  };
  
  console.log('POST /bins', bin);
  if(bin.id === null || bin.id === undefined) {
    bin = store.create(bin.ncco);
  }
  else {
    bin = store.update(bin.id, bin.ncco);
  }
  res.json(bin);
});

app.get('/answer', (req, res) => {
  // Prompt the user for their NCCO ID
  const ncco = [
    {
      action: 'talk',
      text: 'Please enter your N C C O bin ID followed by the hash key',
      timeOut: 5,
      bargeIn: true,
      voiceName: 'Amy'
    },
    {
      action: 'input',
      submitOnHash: true,
      eventUrl: ['https://nexmo.ngrok.io/find-bin']
    }
  ];
  
  res.json(ncco);
});

app.post('/find-bin', (req, res) => {
  const binId = req.body.dtmf;
  let bin = store.read(binId);
  let ncco = null;
  
  if(!bin) {
    ncco = [{
      action: 'talk',
      text: `Error. Cannot find N C C O bin with I D of . ${binId.replace(/(\d)/g, '$1 ')}`,
      voiceName: 'Amy'
    }];
  }
  else {
    ncco = JSON.parse(bin.ncco.replace('\n', ''));
  }
  res.json(ncco);
});

app.post('/events', (req, res) => {
  // TODO: push events to the relevant NCCO view
});