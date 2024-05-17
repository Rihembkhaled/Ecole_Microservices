const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Etudiant {
    id: String!
    nom: String!
    description: String!
  }

  type Matiere {
    id: String!
    nom: String!
    description: String!
  }
  type Prof {
  id: String!
  nom: String!
  description: String!
}


  type Query {
    etudiant(id: String!): Etudiant
    etudiants: [Etudiant]
    matiere(id: String!): Matiere
    matieres: [Matiere]
    prof(id: String!): Prof
    profs: [Prof]
  }
  type Mutation {
  createEtudiant(nom: String!, description: String!): Etudiant
  deleteEtudiant(id: String!): String
  createMatiere(nom: String!, description: String!): Matiere
  deleteMatiere(id: String!): String
  updateEtudiant(id: String!, nom: String!, description: String!): Etudiant # Mutation pour mettre à jour un etudiant
  updateMatiere(id: String!, nom: String!, description: String!): Matiere
  createProf(nom: String!,  description:String!): Prof
  deleteProf(id: String!): String
  updateProf(id: String!, nom: String!,  description: String!): Prof
}

`;

module.exports = typeDefs;
