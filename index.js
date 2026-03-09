require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.API_KEY;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", (req, res) => {
  res.render("homepage");
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
  });

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {

  const createObjectUrl =
    "https://app-eu1.hubspot.com/contacts/146961743/objects/0-2/views/all";

  const newObject = {
    properties: {
      customname: req.body.customname,
      customtesttroperty: req.body.customtestproperty,
      customMultipleoptions: req.body.custommultipleoptions,
    },
  };

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createObjectUrl, newObject, { headers });
    console.log(req.body);
    res.redirect("/");

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
});

// This is sample code to give you a reference for how you should structure your calls. 

//  App.get sample

app.get('/contacts', async (req, res) => {
    const companies = 'https://app-eu1.hubspot.com/contacts/146961743/objects/0-2/';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(companies, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Companies | HubSpot APIs', data });      
        res.redirect("/");
        console.log(data,'data');
    } catch (error) {
        console.error(error);
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));