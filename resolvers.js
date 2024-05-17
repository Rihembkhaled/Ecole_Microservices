//resolver.js 
const { ApolloError } = require('apollo-server');
const Etudiant = require('./etudiant');
const Matiere = require('./matiere');
const Prof = require('./prof');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { sendMatiereMessage } = require('./MatiereProducer'); // Importer la fonction d'envoi de message Kafka
const { sendProfMessage } = require('./profProducer'); // Importer la fonction d'envoi de message Kafka pour les profs
const { sendEtudiantMessage } = require('./EtudiantProducer');



// Charger les fichiers Protobuf
const etudiantProtoPath = './etudiant.proto';
const matiereProtoPath = './matiere.proto';
const profProtoPath = './prof.proto';

// Charger les définitions Protobuf
const etudiantProtoDefinition = protoLoader.loadSync(etudiantProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const matiereProtoDefinition = protoLoader.loadSync(matiereProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const profProtoDefinition = protoLoader.loadSync(profProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Obtenir les services gRPC
const etudiantProto = grpc.loadPackageDefinition(etudiantProtoDefinition).etudiant;
const matiereProto = grpc.loadPackageDefinition(matiereProtoDefinition).matiere;
const profProto = grpc.loadPackageDefinition(profProtoDefinition).prof;

const clientEtudiant = new etudiantProto.EtudiantService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

const clientMatiere = new matiereProto.MatiereService(
  'localhost:50054',
  grpc.credentials.createInsecure()
);

const clientProf = new profProto.ProfService(
  'localhost:50055',
  grpc.credentials.createInsecure()
);

const resolvers = {
  Query: {
    etudiant: async (_, { id }) => {
      try {
        return await Etudiant.findById(id); // Trouver le etudiant par ID
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche du etudiant: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    etudiants: async () => {
      try {
        return await Etudiant.find(); // Trouver tous les etudiants
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche des etudiants: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    matiere: async (_, { id }) => {
      try {
        return await Matiere.findById(id); // Trouver le matiere par ID
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche du matiere: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    matieres: async () => {
      try {
        return await Matiere.find(); // Trouver tous les matieres
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche des matieres: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    prof: async (_, { id }) => {
      try {
        return await Prof.findById(id); // Trouver le prof par ID
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche du prof: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  
    profs: async () => {
      try {
        return await Prof.find(); // Trouver tous les profs
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche des profs: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
  Mutation: {

    createMatiere: async (_, { nom, description }) => {
      try {
        const nouvelleMatiere = new Matiere({ nom, description });
        const matiere = await nouvelleMatiere.save(); // Sauvegarder la matiere
        
        // Envoyer un message Kafka pour l'événement de création de matiere
        await sendMatiereMessage('creation', { id: matiere._id, nom, description });
    
        return matiere; // Retourner la matiere créée
      } catch (error) {
        throw new ApolloError(`Erreur lors de la création de la matiere: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    // Mutation pour supprimer une matiere
    deleteMatiere: async (_, { id }) => {
      try {
        const matiere = await Matiere.findByIdAndDelete(id); // Supprimer par ID
        if (!matiere) {
          throw new ApolloError("Matiere non trouvée", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de suppression de matiere
        await sendMatiereMessage('suppression', { id });
    
        return "Matiere supprimée avec succès";
      } catch (error) {
        throw new ApolloError(`Erreur lors de la suppression de la matiere: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    // Mutation pour mettre à jour une matiere
    updateMatiere: async (_, { id, nom, description }) => {
      try {
        const matiere = await Matiere.findByIdAndUpdate(
          id,
          { nom, description },
          { new: true } // Retourner la matiere mise à jour
        );
    
        if (!matiere) {
          throw new ApolloError("Matiere non trouvée", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de modification de matiere
        await sendMatiereMessage('modification', { id: matiere._id, nom, description });
    
        return matiere; // Matiere mise à jour
      } catch (error) {
        throw new ApolloError(`Erreur lors de la mise à jour de la matiere: ${error.message}`, "INTERNAL_ERROR");
      }
    },



    createEtudiant: async (_, { nom, description }) => {
      try {
        const nouveauEtudiant = new Etudiant({ nom, description });
        const etudiant = await nouveauEtudiant.save(); // Sauvegarder le etudiant
        
        // Envoyer un message Kafka pour l'événement de création de etudiant
        await sendEtudiantMessage('creation', { id: etudiant._id, nom, description });


        return etudiant; // Retourner le etudiant créé
      } catch (error) {
        throw new ApolloError(`Erreur lors de la création du etudiant: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    deleteEtudiant: async (_, { id }) => {
      try {
        const etudiant = await Etudiant.findByIdAndDelete(id); // Supprimer par ID
        if (!etudiant) {
          throw new ApolloError("Etudiant non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de suppression de etudiant
        await sendEtudiantMessage('suppression', { id });
    
        return "Etudiant supprimé avec succès";
      } catch (error) {
        throw new ApolloError(`Erreur lors de la suppression du etudiant: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    updateEtudiant: async (_, { id, nom, description }) => {
      try {
        const etudiant = await Etudiant.findByIdAndUpdate(
          id,
          { nom, description },
          { new: true } // Retourner le etudiant mis à jour
        );
        
        if (!etudiant) {
          throw new ApolloError("Etudiant non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de modification de etudiant
        await sendEtudiantMessage('modification', { id: etudiant._id, nom, description });
    
        return etudiant; // Etudiant mis à jour
      } catch (error) {
        throw new ApolloError(`Erreur lors de la mise à jour du etudiant: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    createProf: async (_, { nom, description }) => {
      try {
        const nouveauProf = new Prof({ nom, description });
        const prof = await nouveauProf.save(); // Sauvegarder le prof
        
        // Envoyer un message Kafka pour l'événement de création de prof
        await sendProfMessage('creation', { id: prof._id, nom, description });
  
        return prof; // Retourner le prof créé
      } catch (error) {
        throw new ApolloError(`Erreur lors de la création du prof: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    deleteProf: async (_, { id }) => {
      try {
        const prof = await Prof.findByIdAndDelete(id); // Supprimer par ID
        if (!prof) {
          throw new ApolloError("Prof non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de suppression de prof
        await sendProfMessage('suppression', { id });
    
        return "Prof supprimé avec succès";
      } catch (error) {
        throw new ApolloError(`Erreur lors de la suppression du prof: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    updateProf: async (_, { id, nom, description }) => {
      try {
        const prof = await Prof.findByIdAndUpdate(
          id,
          { nom, description },
          { new: true } // Retourner le prof mis à jour
        );
        
        if (!prof) {
          throw new ApolloError("Prof non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de modification de prof
        await sendProfMessage('modification', { id: prof._id, nom, description });
    
        return prof; // prof mis à jour
      } catch (error) {
        throw new ApolloError(`Erreur lors de la mise à jour du prof: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
};

module.exports = resolvers;
