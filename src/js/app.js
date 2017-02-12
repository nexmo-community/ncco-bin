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

const binStatusEl = document.getElementById('bin_status');

var binMatch = document.location.pathname.match(/(\/bins\/)(\d+)/);
var bin = {
  id: (binMatch && binMatch[2]? binMatch[2] : null),
  ncco: null
};

function update() {
  try {
    // test parse
    var ncco = editor.getValue();
    JSON.parse(ncco)
    bin.ncco = ncco;
  }
  catch(e) {
    binStatusEl.innerHTML = `<span class="error">${e.message}</span>`;
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
    console.log('bin updated', json);
    binStatusEl.innerHTML = `<span class="success">bin successfully saved</span>`;
  }).catch((err) => {
    binStatusEl.innerHTML = `<span class="error">Error updating bin: ${err.message}</span>`;
    console.error(err);
  });
}

editor.on('change', update);
