//apiGateway.js
const express = require("express"); // Framework Express
const bodyParser = require("body-parser"); // Pour traiter le JSON
const cors = require("cors"); // Pour autoriser les requêtes cross-origin

const connectDB = require("./database"); // Connexion à MongoDB
const Etudiant = require("./etudiant"); // Modèle Etudiant
const Matiere = require("./matiere"); // Modèle Matiere
const Prof = require("./prof"); // Modèle Prof
const { sendMatiereMessage } = require("./MatiereProducer");
const { sendProfMessage } = require("./profProducer"); // Importer la fonction d'envoi de message Kafka pour les profs
const { sendEtudiantMessage } = require("./EtudiantProducer"); // Importer la fonction d'envoi de message Kafka pour les etudiants

const app = express(); // Créer l'application Express

// Connexion à MongoDB
connectDB();

app.use(cors()); // Autoriser les requêtes cross-origin
app.use(bodyParser.json()); // Traiter le JSON

app.get("/etudiant/:id", async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).send("Etudiant non trouvé");
    }
    res.json(etudiant);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la recherche du etudiant: " + err.message);
  }
});

app.post("/etudiant", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const nouveauEtudiant = new Etudiant({ nom, description });
    const etudiant = await nouveauEtudiant.save();
    await sendEtudiantMessage("creation", {
      id: etudiant._id,
      nom,
      description,
    });
    res.json(etudiant);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la création du etudiant: " + err.message);
  }
});

app.delete("/etudiant/:id", async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).send("Etudiant non trouvé");
    }
    await sendEtudiantMessage("suppression", { id: etudiant._id });
    res.json({ message: "Etudiant supprimé avec succès" });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la suppression du etudiant: " + err.message);
  }
});

app.put("/etudiant/:id", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updatedEtudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true }
    );
    if (!updatedEtudiant) {
      return res.status(404).send("Etudiant non trouvé");
    }
    await sendEtudiantMessage("modification", {
      id: updatedEtudiant._id,
      nom,
      description,
    });
    res.json(updatedEtudiant);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du etudiant: " + err.message);
  }
});

app.delete("/etudiant/:id", async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).send("Etudiant non trouvé");
    }
    await sendEtudiantMessage("suppression", { id: etudiant._id });
    res.json({ message: "Etudiant supprimé avec succès" });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la suppression du etudiant: " + err.message);
  }
});

// Endpoint pour mettre à jour un etudiant
app.put("/etudiant/:id", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updatedEtudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true }
    );
    if (!updatedEtudiant) {
      return res.status(404).send("Etudiant non trouvé");
    }
    await sendEtudiantMessage("modification", {
      id: updatedEtudiant._id,
      nom,
      description,
    });
    res.json(updatedEtudiant);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du etudiant: " + err.message);
  }
});

// Endpoints pour les matieres
app.get("/matiere", async (req, res) => {
  try {
    const matieres = await Matiere.find(); // Obtenir tous les matieres
    res.json(matieres);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la recherche des matieres: " + err.message);
  }
});

app.get("/matiere/:id", async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id); // Obtenir le matiere par ID
    if (!matiere) {
      return res.status(404).send("Matiere non trouvé");
    }
    res.json(matiere);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la recherche du matiere: " + err.message);
  }
});

app.post("/matiere", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const nouveauMatiere = new Matiere({ nom, description });
    const matiere = await nouveauMatiere.save(); // Sauvegarder le matiere

    // Envoyer un message Kafka pour l'événement de création de matiere
    await sendMatiereMessage("creation", { id: matiere._id, nom, description });
    res.json(matiere); // Retourner le matiere créé
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la création du matiere: " + err.message);
  }
});

// Endpoint pour supprimer un matiere
app.delete("/matiere/:id", async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndDelete(req.params.id); // Supprimer le matiere par ID
    if (!matiere) {
      return res.status(404).send("Matiere non trouvé");
    }
    //Envoyer un message Kafka pour l'événement de suppression de matiere
    await sendMatiereMessage("suppression", { id: matiere._id });
    res.json({ message: "Matiere supprimé avec succès" });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la suppression du matiere: " + err.message);
  }
});
// Endpoint pour mettre à jour un matiere

app.put("/matiere/:id", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updatedMatiere = await Matiere.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true }
    );
    if (!updatedMatiere) {
      return res.status(404).send("Matiere non trouvé");
    }
    // Envoyer un message Kafka pour la modification du matiere
    await sendMatiereMessage("modification", {
      id: updatedMatiere._id,
      nom,
      description,
    });
    res.json(updatedMatiere);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du matiere: " + err.message);
  }
});

// Endpoints pour les profs
app.get("/prof", async (req, res) => {
  try {
    const profs = await Prof.find(); // Obtenir tous les profs
    res.json(profs);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la recherche des profs: " + err.message);
  }
});

app.get("/prof/:id", async (req, res) => {
  try {
    const prof = await Prof.findById(req.params.id); // Obtenir le prof par ID
    if (!prof) {
      return res.status(404).send("Prof non trouvé");
    }
    res.json(prof);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la recherche du prof: " + err.message);
  }
});

app.post("/prof", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const nouveauProf = new Prof({ nom, description });
    const prof = await nouveauProf.save(); // Sauvegarder le prof

    // Envoyer un message Kafka pour l'événement de création de prof
    await sendProfMessage("creation", { id: prof._id, nom, description });

    res.json(prof); // Retourner le prof créé
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la création du prof: " + err.message);
  }
});


// Endpoint pour supprimer un prof
app.delete("/prof/:id", async (req, res) => {
  try {
    const prof = await Prof.findByIdAndDelete(req.params.id); // Supprimer le prof par ID
    if (!prof) {
      return res.status(404).send("Prof non trouvé");
    }
    // Envoyer un message Kafka pour la suppression du matiere
    await sendProfMessage("suppression", { id: prof._id }); // <--- Correction ici
    res.json({ message: "Prof supprimé avec succès" });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la suppression du prof: " + err.message);
  }
});


// Endpoint pour mettre à jour un prof
app.put("/prof/:id", async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updatedProf = await Prof.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true }
    );
    if (!updatedProf) {
      return res.status(404).send("Prof non trouvé");
    }
    // Envoyer un message Kafka pour la modification du matiere
    await sendProfMessage("modification", {
      id: updatedProf._id,
      nom,
      description,
    });
    res.json(updatedProf);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du prof: " + err.message);
  }
});

// Démarrer le serveur Express
const port = 3002;
app.listen(port, () => {
  console.log(`API Gateway opérationnel sur le port ${port}`);
});
