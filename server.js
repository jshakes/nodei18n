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

var init = (function(){
  
  var i18n = require("i18n");
  var ejs = require("ejs");
  var fs = require('fs');

  i18n.configure({
    locales:['en', 'de'],
    directory: 'locales',
    defaultLocale: 'en',
  });

  t = function(key){

    i18n.setLocale('de');
    return i18n.__(key)
  }

  file = fs.readFileSync("template.mustache.ejs", 'utf8');

  html = ejs.render(file);

  console.log(html);
})();