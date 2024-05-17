const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'matiere-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'matiere-group' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'matiere-events', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log('Received matiere event:', event);
        // Traitez l'événement d'équipe ici en fonction de l'événement reçu (création, modification, suppression, etc.)
        // Exemple : Appelez les fonctions appropriées pour gérer les événements d'équipe
        switch (event.eventType) {
          case 'creation':
            handleMatiereCreation(event.matiereData);
            break;
          case 'modification':
            handleMatiereModification(event.matiereData);
            break;
          case 'suppression':
            handleMatiereSuppression(event.matiereData);
            break;
          default:
            console.warn('Event type not recognized:', event.eventType);
        }
      },
    });
  } catch (error) {
    console.error('Error with Kafka consumer:', error);
  }
};

const handleMatiereCreation = (matiereData) => {
  console.log('Handling matiere creation event:', matiereData);
  // Logique pour gérer la création d'équipe ici
};

const handleMatiereModification = (matiereData) => {
  console.log('Handling matiere modification event:', matiereData);
  // Logique pour gérer la modification d'équipe ici
};

const handleMatiereSuppression = (matiereData) => {
  console.log('Handling matiere suppression event:', matiereData);
  // Logique pour gérer la suppression d'équipe ici
};

run().catch(console.error);
