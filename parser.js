
var trans = i18n.init(
  { 
    lng: "de_DE",
    fallbackLng: "en_US"
  }, function(){

    html = new EJS({url: 'template.mustache.ejs'}).render();

    console.log(html);
  }
);

var t = translate = function(key){

  if(!i18n.exists(key)){
    console.log("i don't exist lol");
  }
  return i18n.t(key)
}
