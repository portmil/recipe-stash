const mongoose = require('mongoose')

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

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Recipe', recipeSchema)