
var langs_to_translate = ["de", "en", "fr"];

for(var i = 0; i < langs_to_translate.length; i++){

  var lang = langs_to_translate[i];

  var properties = {
    input_dir: "templates",
    active_lang: lang,
    fallback_lang: "en",
    output_dir: "output"
  }

  var parser = new Parser(properties);

  parser.translate_files();
}


function Parser(properties){

  this.i18n = require("i18n");
  this.ejs = require("ejs");
  this.fs = require('fs');

  Parser.prototype._init = function(){  

    var that = this;
        
    for (var i in properties){

      (function(i){

        that[i] = properties[i];
        
      })(i);
    }

    this.i18n.configure({
      locales: [that.active_lang, that.fallback_lang],
      directory: 'locales',
      defaultLocale: 'en'
    });
  }

  Parser.prototype.translate_files = function(){

    var that = this;

    //create the output directory if necessary
    var lang_dir = this.output_dir + "/" + this.active_lang;

    !this.fs.existsSync(lang_dir, function(exists){

      if(!exists) that.fs.mkdir(lang_dir, function(){
        console.log("created directory at " + lang_dir);
      });
    });

    this.fs.readdir(this.input_dir, function(err, files){

      if(err) console.log(err);
      else{

        for(var i = 0; i < files.length; i++){

          var file = files[i];
          
          (function(file){
            console.log("Parsing " + file + "...");
            var html = that.parse_file(file);
            
            if(html){

              output_path = that.output_dir + "/" + that.active_lang + "/" + file.substring(0, file.indexOf(".ejs"));
              that.write_output_to_file(output_path, html);
            }
          })(file);
        }
      }
    });
  }

  Parser.prototype.write_output_to_file = function(output_path, content){

    var stream = this.fs.createWriteStream(output_path);

    stream.once('open', function(fd) {
      
      content_arr = content.split("/n"); //split html block into array by line breaks

      for(var i = 0; i < content_arr.length; i++){

        stream.write(content_arr[i]); // write each line to the buffer
      }
      console.log("Template saved to " + output_path);
      stream.end();
    });
  }

  Parser.prototype.parse_file = function(path){

    var that = this;

    file = this.fs.readFileSync(this.input_dir + "/" + path, 'utf8');
    html = this.ejs.render(file, {that: that});
    return html;
  }

  t = function(that, key, vars){

    var translation

    that.i18n.setLocale(that.active_lang);
    
    if(vars != undefined && vars.length){

      vars.unshift(key);
      translation = that.i18n.__.apply(this, vars);
    }
    else translation = that.i18n.__(key);

    return translation;
  }

  this._init();
}