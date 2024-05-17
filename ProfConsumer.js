const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  profId: 'prof-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'prof-group' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'prof-events', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log('Received prof event:', event);
        // Traitez l'événement d'équipe ici en fonction de l'événement reçu (création, modification, suppression, etc.)
        // Exemple : Appelez les fonctions appropriées pour gérer les événements d'équipe
        switch (event.eventType) {
          case 'creation':
            handleProfCreation(event.profData);
            break;
          case 'modification':
            handleProfModification(event.profData);
            break;
          case 'suppression':
            handleProfSuppression(event.profData);
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

const handleProfCreation = (profData) => {
  console.log('Handling prof creation event:', profData);
  // Logique pour gérer la création d'équipe ici
};

const handleProfModification = (profData) => {
  console.log('Handling prof modification event:', profData);
  // Logique pour gérer la modification d'équipe ici
};

const handleProfSuppression = (profData) => {
  console.log('Handling prof suppression event:', profData);
  // Logique pour gérer la suppression d'équipe ici
};

run().catch(console.error);