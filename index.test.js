const { execSync } = require('child_process')
execSync('npm install')
execSync('npm run seed')

const { describe, test, expect } = require('@jest/globals')
const request = require('supertest')
const app = require('./src/app')
const Restaurant = require('./models/index')

describe('/restaurants endpoint', () => {
	test('GET /restaurants returns 200', async () => {
		const res = await request(app).get('/restaurants')
		expect(res.statusCode).toBe(200)
	})

	test('GET /restaurants returns an array of restaurants', async () => {
		const res = await request(app).get('/restaurants')
		expect(Array.isArray(res.body)).toBe(true)
		expect(res.body[0]).toHaveProperty('cuisine')
	})

	test('GET /restaurants returns correct number of restaurants', async () => {
		const restaurants = await Restaurant.findAll()
		const res = await request(app).get('/restaurants')
		expect(res.body.length).toEqual(restaurants.length)
	})

	test('GET /restaurants returns correct restaurant data', async () => {
		const restaurants = await Restaurant.findAll()
		const res = await request(app).get('/restaurants')

		const expectedRestaurants = restaurants.map((restaurant) => {
			return {
				...restaurant.toJSON(),
				createdAt: restaurant.createdAt.toISOString(),
				updatedAt: restaurant.updatedAt.toISOString()
			}
		})
		expect(res.body).toEqual(expectedRestaurants)
	})

	test('GET /restaurants/:id returns correct restaurant', async () => {
		const restaurantId = 1
		const res = await request(app).get(`/restaurants/${restaurantId}`)
		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual(
			expect.objectContaining({
				id: 1,
				name: 'AppleBees',
				location: 'Texas',
				cuisine: 'FastFood'
			})
		)
	})

	test('POST /restaurants', async () => {
		const restauntData = {
			name: 'Burger King',
			location: 'Hawaii',
			cuisine: 'American'
		}

		const response = await request(app)
			.post('/restaurants')
			.send(restauntData)
			.expect(200)

		expect(response.body).toMatchObject(restauntData)
	})

	test('PUT /restaurants/:id', async () => {
		const updatedData = {
			name: 'Great Wall',
			location: 'Austin',
			cuisine: 'Chinese'
		}

		const res = await request(app)
			.put(`/restaurants/1`)
			.send(updatedData)
			.expect(200)

		const restaurant = await Restaurant.findByPk(1)

		expect(res.status).toBe(200)
		expect(restaurant.name).toEqual('Great Wall')
	})

	test('DELETE /restaurants/:id', async () => {
		const res = await request(app).delete(`/restaurants/1`).expect(200)

		const restaurants = await Restaurant.findAll()

		expect(res.status).toBe(200)
		expect(restaurants[0].id).not.toEqual(1)
	})
})
