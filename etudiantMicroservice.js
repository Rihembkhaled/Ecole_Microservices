//fournissuermicroservice
const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf
const mongoose = require('mongoose'); // Pour MongoDB
const Etudiant = require('./etudiant'); // Modèle Mongoose pour les etudiants
const { sendEtudiantMessage } = require('./EtudiantProducer'); // Producteur Kafka pour les etudiants

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

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecole') // Utilisez IPv4 pour éviter les problèmes
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1); // Quitte le processus en cas d'erreur
  });

// Implémentation du service gRPC pour les etudiants
const etudiantService = {
  getEtudiant: async (call, callback) => {
    try {
      const etudiantId = call.request.etudiant_id;
      const etudiant = await Etudiant.findById(etudiantId);

      if (!etudiant) {
        return callback(new Error("Etudiant non trouvé"));
      }

      callback(null, { etudiant });
    } catch (err) {
      callback(new Error("Erreur lors de la recherche du etudiant"));
    }
  },

  searchEtudiants: async (call, callback) => {
    try {
      const etudiants = await Etudiant.find();
      callback(null, { etudiants });
    } catch (err) {
      callback(new Error("Erreur lors de la recherche des etudiants"));
    }
  },

  createEtudiant: async (call, callback) => {
    try {
      const { nom, email } = call.request;
      const nouveauEtudiant = new Etudiant({ nom, email });
      const etudiant = await nouveauEtudiant.save();

      // Envoyer un événement Kafka pour la création d'un etudiant
      await sendEtudiantMessage('creation', etudiant);

      callback(null, { etudiant });
    } catch (err) {
      callback(new Error("Erreur lors de la création du etudiant"));
    }
  },

  updateEtudiant: async (call, callback) => {
    try {
      const { etudiant_id, nom, email } = call.request;
      const etudiant = await Etudiant.findByIdAndUpdate(
        etudiant_id,
        { nom, email },
        { new: true } // Retourner le etudiant mis à jour
      );

      if (!etudiant) {
        return callback(new Error("Etudiant non trouvé"));
      }

      // Envoyer un événement Kafka pour la mise à jour d'un etudiant
      await sendEtudiantMessage('modification', etudiant);

      callback(null, { etudiant });
    } catch (err) {
      callback(new Error("Erreur lors de la mise à jour du etudiant: " + err.message));
    }
  },

  deleteEtudiant: async (call, callback) => {
    try {
      const etudiantId = call.request.etudiant_id;
      const etudiant = await Etudiant.findByIdAndDelete(etudiantId);

      if (!etudiant) {
        return callback(new Error("etudiant non trouvé"));
      }

      // Envoyer un événement Kafka pour la suppression d'un etudiant
      await sendEtudiantMessage('suppression', etudiant);

      callback(null, { message: "etudiant supprimé avec succès" });
    } catch (err) {
      callback(new Error("Erreur lors de la suppression du etudiant: " + err.message));
    }
  },
};

// Créer le serveur gRPC
const server = new grpc.Server();
server.addService(etudiantProto.EtudiantService.service, etudiantService);

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Échec de la liaison du serveur:", err);
    return;
  }
  server.start();
  console.log(`Service etudiant opérationnel sur le port ${boundPort}`);
});
