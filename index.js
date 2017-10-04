var SERVER_productname = 'productsapi'
var PORT = 3000;
var HOST = '127.0.0.1';

//request counters
var getcounter = 0;

var postcounter = 0;
var deletecounter = 0;


var restify = require('restify')

  // Get a persistence engine for the products
  , productSave = require('save') ('products')

  // Create the restify server
  , server = restify.createServer({ productname: SERVER_productname})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.productname, server.url)
  console.log('below are the services Started:')
  console.log(' /getProduct')
  console.log(' /getProduct/:id')
  console.log(' /createProduct')
  console.log(' /updateProduct/:id')
  console.log(' /deleteProduct/:id')
  console.log('Processed request count --> Get Product: ' +getcounter + ', PostProduct: ' + postcounter + ', Delete ' + deletecounter)
  


})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

  // Get all products in the system
server.get('/getProduct', function (req, res, next) {
    console.log('>>>' + server.url + '/getAllProduct: recieved GET request')
      // Find every entity within the given collection
      productSave.find({}, function (error, product) {
    
        // Return all of the products in the system
  console.log('<<<' + server.url + '/getProduct: sending response')
        res.send(product)
  getcounter++;
  console.log('Processed request count --> Get Product: ' +getcounter + ', PostProduct: ' + postcounter + ', Delete ' + deletecounter)
      })
    })

// Get a single product by their product id
server.get('/getProduct/:id', function (req, res, next) {
     console.log('>>>' + server.url + '/getProduct:id: recieved GET request')
      // Find a single product by their id within save
      productSave.findOne({ _id: req.params.id }, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        if (product) {
          // Send the product if no issues
  console.log('<<<' + server.url + '/getProduct:id: sending response')
          res.send(product)
    getcounter++;
    console.log('Processed request count --> Get Product: ' +getcounter + ', PostProduct: ' + postcounter + ', Delete ' + deletecounter)
        
        } else {
          // Send 404 header if the product doesn't exist
          res.send(404)
        }
      })
    })

    // Create a new product
    server.post('/createProduct', function (req, res, next) {
    console.log('>>>' + server.url + '/createProduct: recieved POST request')
      // Make sure productname is defined
      if (req.params.productname === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('productname must be supplied'))
      }
      if (req.params.cost === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('cost must be supplied'))
      }
      var newProduct = {
            productname: req.params.productname, 
            cost: req.params.cost
        }
    
      // Create the product using the persistence engine
      productSave.create(newProduct, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send the product if no issues
  console.log('<<<' + server.url + '/createProduct: sending response')
        res.send(201, product)
        postcounter++;
       console.log('Processed request count --> Get Product: ' +getcounter + ', PostProduct: ' + postcounter + ', Delete ' + deletecounter)
      
      })
    })

// Update a product by their id
server.put('/updateProduct/:id', function (req, res, next) {
  console.log('>>>' + server.url + '/updateProduct: recieved POST request')
    
      // Make sure productname is defined
      if (req.params.productname === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('productname must be supplied'))
      }
      if (req.params.cost === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('cost must be supplied'))
      }
      
      var newProduct = {
            _id: req.params.id,
            productname: req.params.productname, 
            cost: req.params.cost
        }
      
      // Update the product with the persistence engine
      productSave.update(newProduct, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send a 200 OK response
        res.send(200)
        console.log('<<<' + server.url + '/updateProduct: sending response')
        postcounter++;
       console.log('Processed request count --> Get Product: ' +getcounter + ', PostProduct: ' + postcounter + ', Delete ' + deletecounter)
      })
    })

// Delete product with the given id
server.del('/deleteProduct/:id', function (req, res, next) {
  console.log('>>>' + server.url + '/delete: recieved POST request')
      // Delete the product with the persistence engine
      productSave.delete(req.params.id, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send a 204 OK response
        res.send(204)
        console.log('<<<' + server.url + '/delete: sending response')
        deletecounter++;
       console.log('Processed request count --> Get Product: ' +getcounter + ', PostProduct: ' + postcounter + ', Delete ' + deletecounter)
      })
    })