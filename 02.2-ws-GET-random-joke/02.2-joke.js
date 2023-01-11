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

// Require Express
const express = require('express')
const PORT = 3000

// Create a new Express app
const app = express()

// GET /
app.get('/', (req, res) => {
	// res.send("Oh, hi there 😊")
	res.send({
		message: "Oh, hi there 😊",
		lolcats: "Are funny",
		reactions_on_isaks_memes: [
			"rotflol",
			"yolo"
		],
	})
})

// GET /coffee
app.get('/joke', (req, res) => {
	res.send('random joke for ya: ')
})

// Start listening for incoming requests on port 3000
app.listen(PORT, () => {
	console.log(`🥳 Yay, server started on localhost:${PORT}`)
})

