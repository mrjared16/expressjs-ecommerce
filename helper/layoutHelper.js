const cartService = require('../models/cartService')

function hbsHelpers(hbs) {
  return hbs.create({
    helpers: {
      inc: function(value, options) {
        console.log('reading it');
        return parseInt(value) + 1;
      }
    }
  });
}

module.exports = hbsHelpers;
