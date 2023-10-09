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


/* Example POST handling */
/*
app.post('/recipes', (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: 'Content missing' })
  }

  const recipe = new Recipe({
    name: body.name,
    link: body.link || '',
    description: body.description || '',
    rating: body.rating || 1,
    lastMakingDate: body.lastMakingDate || new Date(),
  })

  recipe.save().then(savedRecipe => {
    response.json(savedRecipe)
  })
})
*/
