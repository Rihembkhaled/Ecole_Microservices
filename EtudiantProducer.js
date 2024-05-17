//EtudiantProducer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
66599
const sendEtudiantMessage = async (eventType, etudiantData) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'etudiant-events', // Remplacer 'client-events' par 'etudiant-events'
      messages: [
        { value: JSON.stringify({ eventType, etudiantData }) }
      ],
    });
    console.log('Message Kafka envoyé avec succès pour l\'événement:', eventType);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message Kafka:', error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = {
  sendEtudiantMessage,
};
