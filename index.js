const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

morgan.token('data', function(req, res) { return JSON.stringify(req.body) })

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

// root
app.get('/', (req, res) => {
	res.send("<h1>Hello, world!</h1>")
})

// Get all phonebook entries
app.get('/api/persons', (req, res) => {
	res.json(persons)
})

// Info page
app.get('/info', (req, res) => {
	const entries = persons.length
	const time = new Date()[Symbol.toPrimitive]("string")

	res.send(`
		<p>Phonebook has info for ${entries} people<p>
		<p>${time}</p>
	`)
})

// Get indidual phonebook entry
app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

// Delete phonebook entry
app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
})

// Add entry to the phonebook
app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "Name and number are required"
		})
	}

	const nameExists = persons.map(person => person.name.toLowerCase()).includes(body.name.toLowerCase())

	if (nameExists) {
		return res.status(400).json({
			error: "name must be unique"
		})
	}

	const person = {
		...body,
		id: Math.floor(Math.random() * 100000)
	}

	persons = persons.concat(person)

	res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`)
})
