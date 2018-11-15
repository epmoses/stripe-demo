const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Setup
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

// Stripe Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
    // console.log(req.body)
     // req.body (form data from body parser). The form sends back an object with the stripeToken (reference to the card), stripeTokenType, and stripeEmail. 
    // Create and charge customers
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount: amount,
        description: 'The World of Pooh',
        currency: 'usd',
        customer: customer.id
    })).then(charge => res.render('success'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})