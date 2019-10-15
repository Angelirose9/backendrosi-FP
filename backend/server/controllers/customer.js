const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

// Model
const {Customers} = require('../models/customer')

var imagepath = 'tmp/my-uploads/'
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/my-uploads/')
  },
  filename: function (req, file, cb) {
    var extention = file.originalname.substr(file.originalname.lastIndexOf('.')
    )
    cb(null, file.fieldname + '-' + Date.now() + extention)
  }
})
 
var upload = multer({ storage: storage })

router.post('/insert', upload.single('image'), function (req, res) {
  try {
    var img = req.file.filename

    var myobj = { 
      name: req.body.name, 
      brand: req.body.brand,
      image: img,
      price: req.body.price,
    }
    const customer = new Customers(myobj)
    customer.save()
    res.status(201).send("1 document inserted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find One
router.get('/findOne/:id', async function (req, res) {
  try {
    const id = req.params.id
    var filter = {
      _id: id
    }
    const customers = await Customers.findOne(filter)
    customers.image = 'http://localhost:3000/img/'+customers.image
    res.send(customers)
  } catch (error) {
    // res.status(400).send('Error')
    console.log (error) 
  }
})

// Find All
router.get('/findAll', async function (req, res) {
  try {
    const customers = await Customers.find({})
    const customerData = []
    if (customers) {
      for (var index in customers) {
        customerData.push({
          _id: customers[index]._id,
          name: customers[index].name,
          brand: customers[index].brand,
          image: 'http://localhost:3000/img/' + customers[index].image,
          price: customers[index].price
        })
      }

    }
    res.send(customerData)
  } catch (error) {
    // res.status(400).send('Error')
    console.log(error)
  }
})

// Find All + Filter
router.get('/findAllFilter', async function (req, res) {
  try {
    var filter = {
      brand: req.body.brand
    }
    const customers = await Customers.find(filter)
    res.send(customers)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Delete One
router.delete('/deleteOne/:id', async function (req, res) {
  try {
    var myquery = { 
      _id: req.params.id 
    }

    var customer = await Customers.findOne(myquery)
    if (customer) {
      // Hapus Image
      fs.unlink(imagepath + customer.image, (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
      });
    }      

    await Customers.deleteOne(myquery)
    res.send("1 document deleted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Delete Many
router.delete('/deleteMany', async function (req, res) {
  try {
    var myquery = { 
      brand: "Highway 37 2"
    }
    var result = await Customers.deleteMany(myquery)
    res.send(result.n + " document(s) deleted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Update One
router.patch('/updateOne/:id', upload.single('image'), async function (req, res) {
  try {
    var myquery = { 
      _id: req.params.id
    }
    
    var image = req.file.filename

    var newvalues = { 
      $set: {
        name: req.body.name,
        brand: req.body.brand, 
        image: image,
        price: req.body.price
      } 
    }

    var customer = await Customers.findOne(myquery)
    if (customer) {
      // Hapus Image
      fs.unlink(imagepath + customer.image, (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
      });
    }   

    await Customers.updateOne(myquery, newvalues)
    res.send("1 document updated")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Update Many
router.put('/updateMany', async function (req, res) {
  try {
    var myquery = { 
      name: "Company Inc 2"
    }
    var newvalues = {
      $set: {
        name: "Minnie s"
      } 
    }
    var result = await Customers.updateMany(myquery, newvalues)
    res.send(result.nModified + " document(s) updated")
  } catch (error) {
    res.status(400).send('Error')
  }
})

module.exports = router

