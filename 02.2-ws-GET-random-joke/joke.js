/* shuffla siffra?

# Workshop 2023-01-11

Skriv logiken för att läsa in filen `data/oneliners.json` (innehåller en JSON-array av strängar) och välj slumpmässigt ut ett skämt ifrån array:en som du skickar som svar på GET-requests till `/joke`.

Svaret ska vara ett objekt med attributet `joke` som ska innehålla skämtet.

## Exempel

### `GET /joke`

```json
{
  "joke": "Shhh, I'm Batman"
}
```
*/

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

// Require Express
const express = require('express')
const PORT = 3000

// Create a new Express app
const app = express()

const data = require('./data/oneliners.json')
// shuffleArray(data)

// GET /
app.get('/', (req, res) => {
	res.send(`Oh, hi there 😊\nGo to <a>localhost:3000/joke</a> for a random joke`)

})

// GET /joke
app.get('/joke', (req, res) => {
	shuffleArray(data)
  	res.json(data[0])
});

// Start listening for incoming requests on port 3000
app.listen(PORT, () => {
	console.log(`🥳 Yay, server started on localhost:${PORT}`)
})

