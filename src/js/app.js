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

var binIdEl = document.getElementById('bin_id');
var parseErrorEl = document.getElementById('parse_message');

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
var bin = {
  id: null,
  ncco: null
};
function update() {
  try {
    var ncco = JSON.parse(editor.getValue())
    bin.ncco = JSON.stringify(ncco);
    
    parseErrorEl.textContent = '';
  }
  catch(e) {
    parseErrorEl.textContent = e.message;
    console.error('Bin does not contain valid JSON. Not saving.', e);
    return;
  }
  
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

console.log('registering for "change"');
editor.on('change', update);
