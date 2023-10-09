const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: String,
  description: String,
  rating: { type: Number, min: 1, max: 5 },
  lastMakingDate: { type: Date },
  // categories: [{ type: ObjectId, ref: 'Category' }],
  // userId: { type: ObjectId, ref: 'User' }
})

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Recipe', recipeSchema)
