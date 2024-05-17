//test.js
const grpc = require("@grpc/grpc-js"); // Pour gRPC
const protoLoader = require("@grpc/proto-loader"); // Pour charger Protobuf

// Chemin vers le fichier Protobuf
const profProtoPath = "./prof.proto";

// Charger le Protobuf
const profProtoDefinition = protoLoader.loadSync(profProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Charger le service Prof du package gRPC
const profProto = grpc.loadPackageDefinition(profProtoDefinition).prof;

// Adresse du serveur gRPC
const serverAddress = "localhost:50055";

// Créer un prof gRPC
const client = new profProto.ProfService(
  serverAddress,
  grpc.credentials.createInsecure()
);

// Fonction pour obtenir un prof par ID
function getProfById(profId) {
  const request = { prof_id: profId };

  client.getProf(request, (error, response) => {
    if (error) {
      console.error("Erreur lors de la récupération du prof:", error.message);
      return;
    }
    console.log("Prof récupéré avec succès:", response.prof);
  });
}

// Fonction pour créer un nouveau prof
function createProf(nom, description) {
  const request = { nom, description };

  client.createProf(request, (error, response) => {
    if (error) {
      console.error("Erreur lors de la création du prof:", error.message);
      return;
    }
    console.log("Prof créé avec succès:", response.prof);
  });
}
// Fonction pour supprimer un prof par ID
function deleteProfById(profId) {
  const request = { prof_id: profId };

  client.deleteProf(request, (error, response) => {
    if (error) {
      console.error("Erreur lors de la suppression du prof:", error.message);
      return;
    }
    console.log("Prof supprimé avec succès.");
  });
}

// Fonction pour mettre à jour un prof par ID
function updateProf(profId, nom, description) {
  const request = { prof_id: profId, nom, description };

  client.updateProf(request, (error, response) => {
    if (error) {
      console.error("Erreur lors de la mise à jour du prof:", error.message);
      return;
    }
    console.log("Prof mis à jour avec succès:", response.prof);
  });
}
// Appel de la fonction pour supprimer un client par ID
//const profIdToDelete = '6645228d26d0f685386d7f8e';
//deleteProfById(profIdToDelete);

// Exemple d'utilisation

//const newProfName = "Nouveau Prof";
//const newProfDescription = "Description du nouveau prof";
// Appel de la fonction pour créer un nouveau prof
//createProf("John", "prof de theatre");

// Appel de la fonction pour obtenir un prof par ID
//const profIdToFetch = '6645228d26d0f685386d7f8e';
//getProfById(profIdToFetch);


//const newProfName = 'Nouveau Prof';
//const newProfDescription = 'Description du nouveau prof';
const profIdToFetch = '664523fe26d0f685386d7f92';
updateProf(profIdToFetch, "Smith", "prof de theatre");
