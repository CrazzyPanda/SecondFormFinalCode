const router = require('express').Router();
const passport = require('passport');
// const settings = require('../config/passport')(passport);

let Customer = require('../models/Customer');



//Getting all the customers
router.route('/').get((req, res) => {
    Customer.find()
        .then(customers => res.json(customers))
        .catch(err => res.status(400).json('Error: ' + err)); //status 400 means bad request
        console.log("You are trying to get all customers")
});



//Finding a specific customer
router.route("/:id").get((req, res) => {
    const customerId = req.params.id;

    Customer.findById(customerId) //find customer by id using mongoose model
        .then(result => {
            if(!result){ //check if it exists, respond with 404
                return res.status(404).json({
                    message: "Customer not found with id " + customerId
                });
            }
            res.json(result); //if no error, respond with customer data as json object
        })
        .catch(err => { //catches error, respond with 404 or 500
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    message: "Customer not found with id " + customerIdcustomer});
            }
            return res.status(500).json({
                message: "Error retrieveing character with id " + customerId
            });
        });
        console.log("You are trying to get a customer by id")
});



//Creating a customer
router.route("/").post((req, res) => {
    const customers = req.body;

    const newCustomer = new Customer(customers); //creates new customer, passes in the data from the request body

    newCustomer.save() //saves customer in the database
        .then(data => {
            res.json(data); //once saved, responds with the customer
        })
        .catch(err => res.status(400).json('Error: ' + err)); //catches any errors

    console.log("You are trying to create a customer")
});

module.exports = router;
