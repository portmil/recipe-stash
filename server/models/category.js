const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'is required'] },
  icon: String,
  isDefault: Boolean,
  rankedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  unrankedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

// The combination of user and name must be unique, i.e., prevent a user from
// creating two categories with the same name
categorySchema.index({ 'name' : 1, 'userId' : 1 }, { unique: true })

categorySchema.plugin(uniqueValidator, {
  message: 'category with this name already exists'
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Category', categorySchema)