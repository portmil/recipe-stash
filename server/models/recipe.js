const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const recipeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "is required"] },
  link: String,
  description: String,
  rating: { // User can enter integer values 1-5, and unrated recipes have 0
    type: Number,
    min: 0,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value"
    }
  },
  lastMakingDate: { type: Date },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

// The combination of user and name must be unique, i.e., prevent a user from
// creating two recipes with the same name
recipeSchema.index({ 'name' : 1, 'userId' : 1 }, { unique: true })

recipeSchema.plugin(uniqueValidator, {
  message: 'recipe with this name already exists'
})

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Recipe', recipeSchema)