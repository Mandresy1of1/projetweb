import express from 'express';
import cors from 'cors';
import moment from 'moment';
import data from './data.json' assert { type: 'json' };
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 8000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://127.0.0.1:5173', // URL du front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Extrait les possessions du patrimoine depuis les données en mémoire
const possessions = data.find(item => item.model === 'Patrimoine')?.data.possessions || [];

// Route GET pour obtenir toutes les possessions
app.get('/possession', (req, res) => {
  res.json(possessions);
});

// Route GET pour obtenir une possession spécifique par UUID
app.get('/possession/:uuid', (req, res) => {
  const { uuid } = req.params;
  const possession = possessions.find(p => p.uuid === uuid);
  if (possession) {
    res.json(possession);
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

// Route POST pour créer une nouvelle possession
app.post('/possession', (req, res) => {
  const { possesseur, libelle, valeur, dateDebut, tauxAmortissement, dateFin, jour, valeurConstante } = req.body;
  const newPossession = {
    uuid: uuidv4(), // Génération d'un UUID
    possesseur,
    libelle,
    valeur,
    dateDebut,
    tauxAmortissement,
    dateFin,
    jour,
    valeurConstante
  };
  possessions.push(newPossession);
  res.status(201).json(newPossession);
});

// Route PUT pour mettre à jour une possession
app.put('/possession/:uuid', (req, res) => {
  const { uuid } = req.params;
  const { dateFin, valeur, dateDebut } = req.body;

  console.log('Requête PUT reçue pour:', uuid);
  console.log('Corps de la requête:', req.body);

  const index = possessions.findIndex(p => p.uuid === uuid);
  console.log('Index trouvé:', index);

  if (index !== -1) {
    possessions[index].dateFin = dateFin || possessions[index].dateFin;
    possessions[index].valeur = valeur || possessions[index].valeur;
    possessions[index].dateDebut = dateDebut || possessions[index].dateDebut;
    console.log('Possession mise à jour:', possessions[index]);
    res.json(possessions[index]);
  } else {
    console.log('Possession non trouvée pour:', uuid);
    res.status(404).json({ error: 'Possession not found' });
  }
});

// Route DELETE pour supprimer une possession
app.delete('/possession/:uuid', (req, res) => {
  const { uuid } = req.params;
  const index = possessions.findIndex(p => p.uuid === uuid);

  if (index !== -1) {
    possessions.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

// Autres routes...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
