const { Kafka  } = require('kafkajs');


const kafka = new Kafka({
  profId: 'my-app',
  brokers: ['localhost:9092'],

});

const producer = kafka.producer();


const sendProfMessage = async (eventType, profData) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'prof-events', // Le topic où vous souhaitez envoyer les événements d'équipe
      messages: [
        { value: JSON.stringify({ eventType, profData }) }
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
    sendProfMessage
  };










