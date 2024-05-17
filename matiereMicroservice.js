//matiereMicroservicejs
const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf
const mongoose = require('mongoose'); // Pour MongoDB
const Matiere = require('./matiere'); // Modèle Mongoose pour les matieres
const { sendMatiereMessage } = require('./MatiereProducer');

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

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecole') // Utilisez IPv4 pour éviter les problèmes
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1); // Quitte le processus en cas d'erreur
  });

// Implémentation du service gRPC pour les matieres
const matiereService = {
  getMatiere: async (call, callback) => {
    try {
      const matiereId = call.request.matiere_id;
      const matiere = await Matiere.findById(matiereId);

      if (!matiere) {
        return callback(new Error("Matiere non trouvé"));
      }

      callback(null, { matiere });
    } catch (err) {
      callback(new Error("Erreur lors de la recherche du matiere"));
    }
  },

  searchMatieres: async (call, callback) => {
    try {
      const matieres = await Matiere.find();
      callback(null, { matieres });
    } catch (err) {
      callback(new Error("Erreur lors de la recherche des matieres"));
    }
  },

  createMatiere: async (call, callback) => {
    try {
      const { nom, description } = call.request;
      const nouveauMatiere = new Matiere({ nom, description });
      const matiere = await nouveauMatiere.save();

      // Envoyer un événement Kafka pour la création d'un matiere
      await sendMatiereMessage('creation', matiere);

      callback(null, { matiere });
    } catch (err) {
      callback(new Error("Erreur lors de la création du matiere"));
    }
  },

  updateMatiere: async (call, callback) => {
    try {
      const { matiere_id, nom, description } = call.request;
      const matiere = await Matiere.findByIdAndUpdate(
        matiere_id,
        { nom, description },
        { new: true } // Retourner le matiere mis à jour
      );

      if (!matiere) {
        return callback(new Error("Matiere non trouvé"));
      }

      // Envoyer un événement Kafka pour la mise à jour d'un matiere
      await sendMatiereMessage('modification', matiere);

      callback(null, { matiere });
    } catch (err) {
      callback(new Error("Erreur lors de la mise à jour du matiere: " + err.message));
    }
  },

  deleteMatiere: async (call, callback) => {
    try {
      const matiereId = call.request.matiere_id;
      const matiere = await Matiere.findByIdAndDelete(matiereId);

      if (!matiere) {
        return callback(new Error("Matiere non trouvé"));
      }

      // Envoyer un événement Kafka pour la suppression d'un matiere
      await sendMatiereMessage('suppression', matiere);

      callback(null, { message: "Matiere supprimé avec succès" });
    } catch (err) {
      callback(new Error("Erreur lors de la suppression du matiere: " + err.message));
    }
  },
};

// Créer le serveur gRPC
const server = new grpc.Server();
server.addService(matiereProto.MatiereService.service, matiereService);

server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Échec de la liaison du serveur:", err);
    return;
  }
  server.start();
  console.log(`Service Matiere opérationnel sur le port ${boundPort}`);
});
