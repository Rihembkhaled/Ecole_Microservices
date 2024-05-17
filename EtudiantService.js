const Etudiant = require('./etudiant'); // Modèle Mongoose pour les etudiants

// Créer un nouveau etudiant
const createEtudiant = async (nom, description) => {
  const nouveauEtudiant = new Etudiant({ nom, description });
  return await nouveauEtudiant.save(); // Utilisez `await` pour sauvegarder
};

// Obtenir tous les etudiants
const getEtudiants = async () => {
  return await Etudiant.find(); // Utilisez `await` pour obtenir tous les etudiants
};

// Obtenir un etudiant par ID
const getEtudiantById = async (id) => {
  return await Etudiant.findById(id); // Utilisez `await` pour trouver un etudiant par son ID
};
// Supprimer un etudiant par ID
const deleteEtudiant = async (etudiantId) => {
  const etudiant = await Etudiant.findByIdAndDelete(etudiantId); // Utilisez `findByIdAndDelete`
  if (!etudiant) {
    throw new Error("Etudiant non trouvé"); // Si le etudiant n'existe pas
  }
  return etudiant; // Retournez le etudiant supprimé
};
// Exporter les services
module.exports = {
  createEtudiant,
  getEtudiants,
  getEtudiantById,
  deleteEtudiant,
};
