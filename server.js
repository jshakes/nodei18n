/*

for each file in template src directory:

  Parse file with EJS and i18n
  List missing translations
  Create file from the active file (remove .ejs from the filename)
  Write output to that file

*/

var express = require('express');

// Start the app by listening on <port>
var port = 3000
var app = express();

app.listen(port)
console.log('Express app started on port '+port)

var parser = require("./parser.js");