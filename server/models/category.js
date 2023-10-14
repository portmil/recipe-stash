const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "is required"] },
  rankedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  unrankedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Category', categorySchema)