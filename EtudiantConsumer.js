const { Kafka } = require('kafkajs'); // Importer le module Kafka

// Configuration du client Kafka
const kafka = new Kafka({
  clientId: 'etudiant-consumer', // Identifiant du client Kafka
  brokers: ['localhost:9092'], // Liste des brokers Kafka
});

// Création du consommateur Kafka
const consumer = kafka.consumer({ groupId: 'etudiant-group' }); // Groupe de consommateurs

// Fonction pour exécuter le consommateur Kafka
const run = async () => {
  try {
    await consumer.connect(); // Connexion au broker Kafka
    await consumer.subscribe({ topic: 'etudiant-events', fromBeginning: true }); // S'abonner au topic des événements de etudiant
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString()); // Convertir le message en JSON
        console.log('Received etudiant event:', event); // Afficher le message reçu

        // Traiter l'événement de etudiant en fonction du type d'événement
        switch (event.eventType) {
          case 'creation':
            handleEtudiantCreation(event.etudiantData); // Gérer la création de etudiant
            break;
          case 'modification':
            handleEtudiantModification(event.etudiantData); // Gérer la modification de etudiant
            break;
          case 'suppression':
            handleEtudiantSuppression(event.etudiantData); // Gérer la suppression de etudiant
            break;
          default:
            console.warn('Event type not recognized:', event.eventType); // Avertir en cas de type inconnu
        }
      },
    });
  } catch (error) {
    console.error('Error with Kafka consumer:', error); // Gérer les erreurs
  }
};

// Logique pour gérer la création de etudiant
const handleEtudiantCreation = (etudiantData) => {
  console.log('Handling etudiant creation event:', etudiantData);
  // Ajoutez votre logique pour gérer la création de etudiant ici
};

// Logique pour gérer la modification de etudiant
const handleEtudiantModification = (etudiantData) => {
  console.log('Handling etudiant modification event:', etudiantData);
  // Ajoutez votre logique pour gérer la modification de etudiant ici
};

// Logique pour gérer la suppression de etudiant
const handleEtudiantSuppression = (etudiantData) => {
  console.log('Handling etudiant suppression event:', etudiantData);
  // Ajoutez votre logique pour gérer la suppression de etudiant ici
};

// Exécuter le consommateur Kafka
run().catch(console.error); // Gérer les erreurs globales