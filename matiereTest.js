const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf

// Chemin vers le fichier Protobuf
const matiereProtoPath = './matiere.proto';


// Charger le Protobuf
const matiereProtoDefinition = protoLoader.loadSync(matiereProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Charger le service Matiere du package gRPC
const matiereProto = grpc.loadPackageDefinition(matiereProtoDefinition).matiere;

// Adresse du serveur gRPC
const serverAddress = 'localhost:50054';

// Créer un client gRPC
const client = new matiereProto.MatiereService(serverAddress, grpc.credentials.createInsecure());

// Fonction pour obtenir un matiere par ID
function getMatiereById(matiereId) {
  const request = { matiere_id: matiereId };

  client.getMatiere(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la récupération du matiere:', error.message);
      return;
    }
    console.log('Matiere récupéré avec succès:', response.matiere);
  });
}

// Fonction pour créer un nouveau matiere
function createMatiere(nom, description) {
  const request = { nom, description };

  client.createMatiere(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la création du matiere:', error.message);
      return;
    }
    console.log('Matiere créé avec succès:', response.matiere);
  });
}
// Fonction pour supprimer un matiere par ID
function deleteMatiereById(matiereId) {
  const request = { matiere_id: matiereId };

  client.deleteMatiere(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la suppression du matiere:', error.message);
      return;
    }
    console.log('Matiere supprimé avec succès.');
  });
}

// Fonction pour mettre à jour un matiere par ID
function updateMatiere(matiereId, nom, description) {
  const request = { matiere_id: matiereId, nom, description };

  client.updateMatiere(request, (error, response) => {
    if (error) {
      console.error('Erreur lors de la mise à jour du matiere:', error.message);
      return;
    }
    console.log('Matiere mis à jour avec succès:', response.matiere);
  });
}
// Appel de la fonction pour supprimer un matiere par ID
//const matiereIdToDelete = '6645b83d85f8b6fec03ef084';
deleteMatiereById("6645b83d85f8b6fec03ef084");


// Exemple d'utilisation
//const matiereIdToFetch = '6645b83d85f8b6fec03ef084';
//const newMatiereName = 'Nouveau Matiere';
//const newMatiereDescription = 'Description du nouveau matiere';
// Appel de la fonction pour créer un nouveau matiere
createMatiere("sport", "une fois par semaine");


// Appel de la fonction pour obtenir un matiere par ID
//getMatiereById(matiereIdToFetch);



//const matiereIdToFetch = '663e1fd3f5dbf81627ddf024';
//const newMatiereName = 'Theatre';
//const newMatiereDescription = 'une fois par semaine';
//updateMatiere(matiereIdToFetch, newMatiereName, newMatiereDescription);
