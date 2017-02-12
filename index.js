const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Store = require('./store');
const store = new Store();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', (request, response) => {
  response.render('pages/index');
});

app.get('/bins/:binId', (req, res) => {
  var bin = store.read(req.params.binId);
  if(!bin) {
    return res.redirect('/');
  }
  
  if(req.get('Content-Type') === 'application/json') {
    res.json(bin);
  }
  else {
    res.render('pages/index', {bin, bin});  
  }
});

app.post('/bins', (req, res) => {
  var bin = {
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