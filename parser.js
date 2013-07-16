var properties = {
  input_dir: "templates",
  langs: ["en", "de", "fr"],
  active_lang: "en",
  output_dir: "output"
}

parser = new Parser(properties);

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
      locales: that.langs,
      directory: 'locales',
      defaultLocale: 'en',
    });

    for(var i = 0; i < this.langs.length; i++){

      that.active_lang = that.langs[i];
      
      (function(active_lang){

        //create the output directory if necessary
        var lang_dir = that.output_dir + "/" + active_lang;

        !that.fs.existsSync(lang_dir, function(exists){

          if(!exists) that.fs.mkdir(lang_dir, function(){
            console.log("created directory at " + lang_dir);
          });
        });

        that.fs.readdir(that.input_dir, function(err, files){

          if(err) console.log(err);
          else{

            for(var i = 0; i < files.length; i++){

              var file = files[i];
              
              (function(file){

                var html = that.parse_file(file);
                
                if(html){

                  output_path = that.output_dir + "/" + active_lang + "/" + file.substring(0, file.indexOf(".ejs"));
                  that.write_output_to_file(output_path, html);
                }
              })(file);
            }
          }
        });
      })(that.active_lang);

    }
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
    console.log("language is "+ that.active_lang);

    file = this.fs.readFileSync(this.input_dir + "/" + path, 'utf8');
    html = this.ejs.render(file, {that: that});
    return html;
  }

  t = function(that, key, vars){

    var translation

    that.i18n.setLocale(that.active_lang);

    console.log("language is "+ that.active_lang);
    
    if(vars != undefined && vars.length){

      var args = vars.unshift(key);
      translation = that.i18n.__.call(this, args);
    }
    else translation = that.i18n.__(key);

    return translation;
  }

  this._init();
}