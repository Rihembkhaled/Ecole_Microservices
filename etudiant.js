const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Etudiant = mongoose.model('Etudiant', etudiantSchema);

module.exports = Etudiant; // Assurez-vous que le modèle est bien exporté
