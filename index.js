console.log('Server file loaded');
require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.API_KEY;
console.log('Loaded HubSpot API Key:', process.env.API_KEY);
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const customCompanyUrl = 'https://api.hubapi.com/crm/v3/objects/companies';
// ============================================
// ROUTE 1 - Homepage: fetch custom objects
// ============================================
app.get('/', async (req, res) => {
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		'Content-Type': 'application/json',
	};

	try {
		const resp = await axios.get(customCompanyUrl, { headers });
		const companies = resp.data.results;
		console.log(resp.data.results);
		res.render('homepage', { title: 'Homepage', companies });
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.send('Error fetching data');
	}
});

// ============================================
// ROUTE 2 - Show form to create/update object
// ============================================
app.get('/update-cobj', (req, res) => {
	res.render('updates', {
		title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
	});
});

// ============================================
// ROUTE 3 - Handle form submission (POST)
// ============================================
app.post('/update-cobj', async (req, res) => {
	const newObject = {
		properties: {
			name: req.body.name, 
			domain: req.body.domain,
			archived: req.archived,
		},
	};

	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		'Content-Type': 'application/json',
	};

	try {
		await axios.post(customCompanyUrl, newObject, { headers });
		console.log('New object created:', req.body);
		res.redirect('/');
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.send('Error creating new custom object');
	}
});

// ============================================
// Server start
// ============================================
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
