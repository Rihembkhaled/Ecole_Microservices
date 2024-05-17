//MatiereProducer

const { Kafka  } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const sendMatiereMessage = async (eventType, matiereData) => {
  try {                                                                                    



    
    await producer.connect();
    await producer.send({
      topic: 'matiere-events', // Le topic où vous souhaitez envoyer les événements de matiere
      messages: [
        { value: JSON.stringify({ eventType, matiereData }) }
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
    sendMatiereMessage
};
