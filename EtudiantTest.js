const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf

// Chemin vers le fichier Protobuf
const etudiantProtoPath = './etudiant.proto';


// Charger le Protobuf
const etudiantProtoDefinition = protoLoader.loadSync(etudiantProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Charger le service Etudiant du package gRPC
const etudiantProto = grpc.loadPackageDefinition(etudiantProtoDefinition).etudiant;

// Adresse du serveur gRPC
const serverAddress = 'localhost:50053';

// Créer un client gRPC
const client = new etudiantProto.EtudiantService(serverAddress, grpc.credentials.createInsecure());

// Fonction pour obtenir un etudiant par ID
function getEtudiantById(etudiantId) {
  const request = { etudiant_id: etudiantId };

  client.getEtudiant(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la récupération du etudiant:', error.message);
      return;
    }
    console.log('Etudiant récupéré avec succès:', response.etudiant);
  });
}

// Fonction pour créer un nouveau etudiant
function createEtudiant(nom, description) {
  const request = { nom, description };

  client.createEtudiant(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la création du etudiant:', error.message);
      return;
    }
    console.log('Etudiant créé avec succès:', response.etudiant);
  });
}
// Fonction pour supprimer un etudiant par ID
function deleteEtudiantById(etudiantId) {
  const request = { etudiant_id: etudiantId };

  client.deleteEtudiant(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la suppression du etudiant:', error.message);
      return;
    }
    console.log('Etudiant supprimé avec succès.');
  });
}

// Fonction pour mettre à jour un etudiant par ID
function updateEtudiant(etudiantId, nom, description) {
  const request = { etudiant_id: etudiantId, nom, description };

  client.updateEtudiant(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la mise à jour du etudiant:', error.message);
      return;
    }
    console.log('Etudiant mis à jour avec succès:', response.etudiant);
  });
}

// Appel de la fonction pour mettre à jour un etudiant par ID
const etudiantIdToFetch = '663e1fd3f5dbf81627ddf024'; // ID du etudiant à mettre à jour
const newEtudiantName = 'Nouveau Nom du Etudiant'; // Nouveau nom du etudiant
const newEtudiantDescription = 'Nouvelle description du etudiant'; // Nouvelle description du etudiant
updateEtudiant(etudiantIdToFetch, newEtudiantName, newEtudiantDescription); // Appel de la fonction pour mettre à jour le etudiant

// Vous pouvez également appeler les autres fonctions ici si nécessaire
