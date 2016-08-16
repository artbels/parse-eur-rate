var rp = require('request-promise');
var cheerio = require('cheerio');
var interval = 1000 * 60 * 20; //msecs. Ex 20 minutes = 1000*60*20

(function getRate() {
  var date = new Date().toISOString().slice(0, 10);

  var options = {
    uri: 'http://kurs.com.ua/ajax/mezhbank_table/all/' + date,
    transform: function(body) {
      return cheerio.load(body);
    }
  };

  rp(options)
    .then(function($) {
      var eurSell = $.html().match(/\d{2}\.\d{3,}/gi)[3];
      return postRate(eurSell);
    })
    .then(function(r) {
      var result = /записано|записан|submitted/i.test(r);
      console.log(result);

      setTimeout(function() {
        getRate();
      }, interval);
    })
    .catch(function(err) {
      console.log(err);

      setTimeout(function() {
        getRate();
      }, interval);
    });
})();


function postRate(eurSell) {
  var form = "https://docs.google.com/forms/d/e/1FAIpQLSfbKDleqTsZZV2f878-_mCtGDHR6wsSU3IFJGMzpyrhE1FYSQ/formResponse?ifq&entry.728348166=";
  var postForm = form + eurSell + "&submit=Submit";
  return rp(postForm);
}