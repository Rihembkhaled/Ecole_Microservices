const Prof = require('./prof'); // Modèle du prof

// Créer un nouveau prof
const createProf = async (nom, description) => {
  const nouveauProf = new Prof({ nom, description });
  return await nouveauProf.save(); // Sauvegarde dans la base de données
};

// Obtenir tous les profs
const getProfs = async () => {
  return await Prof.find(); // Obtenir tous les profs
};

// Obtenir un prof par ID
const getProfById = async (id) => {
  return await Prof.findById(id); // Trouver un prof par son ID
};

// Exporter les services
module.exports = {
  createProf,
  getProfs,
  getProfById,
};
