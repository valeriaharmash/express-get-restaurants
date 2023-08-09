const express = require('express')
const app = express()
const Restaurant = require('../models/index')
const db = require('../db/connection')

app.get('/restaurants', async (req, res) => {
	try {
		const data = await Restaurant.findAll()
		res.json(data)
	} catch (err) {
		console.error(err)
	}
})

module.exports = app
