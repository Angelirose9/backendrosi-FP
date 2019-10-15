const {mongoose} = require('../config/db')

var customers = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  brand: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
    trim: true,
    required: true
  },
  price: {
    type: String,
    trim: true,
    required: true
  }

})

var Customers = mongoose.model('customers', customers)

module.exports = {
  Customers: Customers
}