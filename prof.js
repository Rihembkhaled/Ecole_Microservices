const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profSchema = new Schema({
  nom: {
    type: String,
    required: true, // Champs obligatoires
  },
  description: {
    type: String,
    required: true,
  },
});

const Prof = mongoose.model('Prof', profSchema);

module.exports = Prof;
