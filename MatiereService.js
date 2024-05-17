const Matiere = require('./matiere'); // Modèle Mongoose pour les matieres

// Créer un nouveau matiere
const createMatiere = async (nom, description) => {
  const nouveauMatiere = new Matiere({ nom, description }); // Créer un nouveau matiere
  return await nouveauMatiere.save(); // Sauvegarder le matiere
};

// Obtenir tous les matieres
const getMatieres = async () => {
  return await Matiere.find(); // Obtenir tous les matieres
};

// Obtenir un matiere par ID
const getMatiereById = async (id) => {
  const matiere = await Matiere.findById(id); // Trouver un matiere par ID
  if (!matiere) {
    throw new Error("Matiere non trouvé"); // Si le matiere n'existe pas
  }
  return matiere; // Retourner le matiere trouvé
};

// Supprimer un matiere par ID
const deleteMatiere = async (matiereId) => {
  const matiere = await Matiere.findByIdAndDelete(matiereId); // Supprimer par ID
  if (!matiere) {
    throw new Error("Matiere non trouvé"); // Si le matiere n'existe pas
  }
  return matiere; // Retourner le matiere supprimé
};

// Exporter les services
module.exports = {
  createMatiere,
  getMatieres,
  getMatiereById,
  deleteMatiere,
};
