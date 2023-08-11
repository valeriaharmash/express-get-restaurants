const express = require('express')
const app = express()
const Restaurant = require('../models/index')
const db = require('../db/connection')

app.use(express.json())
app.use(express.urlencoded())

app.get('/restaurants', async (req, res) => {
	try {
		const data = await Restaurant.findAll()
		res.json(data)
	} catch (err) {
		console.error(err)
	}
})

app.get('/restaurants/:id', async (req, res) => {
	try {
		const data = await Restaurant.findByPk(req.params.id)
		res.json(data)
	} catch (err) {
		console.error(err)
	}
})

app.post('/restaurants', async (req, res, next) => {
	try {
		const restaurant = await Restaurant.create(req.body)

		if (!restaurant) {
			throw new Error('No restaurant created')
		}
		res.send(restaurant)
	} catch (error) {
		next(error)
	}
})

app.put('/restaurants/:id', async (req, res, next) => {
	try {
		const updated = await Restaurant.update(req.body, {
			where: {
				id: req.params.id
			}
		})

		console.log(updated)

		if (updated[0] === 0) {
			throw new Error('No update made')
		}

		res.sendStatus(200)
	} catch (error) {
		next(error)
	}
})

app.delete('/restaurants/:id', async (req, res, next) => {
	try {
		const deleted = await Restaurant.destroy({
			where: {
				id: req.params.id
			}
		})

		console.log(deleted)

		if (deleted === 0) {
			throw new Error('No restaurant deleted')
		}

		res.sendStatus(200)
	} catch (error) {
		next(error)
	}
})

module.exports = app
