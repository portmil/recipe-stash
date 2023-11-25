require('dotenv').config()
const app = require("./app") // the actual Express application
const config = require("./utils/config")

const Recipe = require('./models/recipe')

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})

/* GET recipes */
app.get('/recipes', (request, response) => {
  Recipe.find({}).then(recipes => {
    response.json(recipes)
  })
})
