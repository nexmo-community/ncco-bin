import '../../node_modules/codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import '../../node_modules/codemirror/mode/javascript/javascript.js';

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: {
    name: "javascript",
    json: true
  }
});