import '../../node_modules/codemirror/lib/codemirror.css';
import '../css/styles.css';

import CodeMirror from 'codemirror';
import '../../node_modules/codemirror/mode/javascript/javascript.js';
import 'whatwg-fetch';

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: {
    name: "javascript",
    json: true
  }
});

const binIdEl = document.getElementById('bin_id');
const parseErrorEl = document.getElementById('parse_message');

var binMatch = document.location.pathname.match(/(\/bins\/)(\d+)/);
var bin = {
  id: (binMatch && binMatch[2]? binMatch[2] : null),
  ncco: null
};
binIdEl.textContent = (bin.id !== null? bin.id : 'not saved');

function update() {
  try {
    // test parse
    var ncco = editor.getValue();
    JSON.parse(ncco)
    bin.ncco = ncco;
    
    parseErrorEl.textContent = '';
  }
  catch(e) {
    parseErrorEl.textContent = e.message;
    console.error('Bin does not contain valid JSON. Not saving.', e);
    return;
  }
  
  /*
  If no bin presently exists create one
  POST /bins
  {
    "ncco": "contents of editor"
  }

  Response:

  {
    "id": "unique id that can be used upon calling",
    "ncco": "ncco contents JSON"
  }
  */
  fetch('/bins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bin)
  }).then((res) => {
    return res.json();
  }).then((json) => {
    console.log('Updating bin', json);
    bin = json;
    binIdEl.textContent = bin.id;
  }).catch((err) => {
    console.error(err);
  });
}

editor.on('change', update);
