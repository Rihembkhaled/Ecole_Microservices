//matiere.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matiereSchema = new Schema({
  nom: {
    type: String,
    required: true, // Champs obligatoires
  },
  description: {
    type: String,
    required: true,
  },
});

const Matiere = mongoose.model('Matiere', matiereSchema);

module.exports = Matiere;
