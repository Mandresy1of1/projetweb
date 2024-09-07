import express from 'express';
import cors from 'cors';
import moment from 'moment';
import data from './data.json' assert { type: 'json' };
import bodyParser from 'body-parser';

const app = express();
const port = 8000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());
app.use(bodyParser.json()); // Ajouté pour traiter les requêtes JSON
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

// Route GET pour obtenir une possession spécifique par libelle
app.get('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    res.json(possession);
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

// Route POST pour créer une nouvelle possession
app.post('/possession', (req, res) => {
  const { possesseur, libelle, valeur, dateDebut, tauxAmortissement, dateFin, jour, valeurConstante } = req.body;
  const newPossession = { possesseur, libelle, valeur, dateDebut, tauxAmortissement, dateFin, jour, valeurConstante };
  possessions.push(newPossession);
  res.status(201).json(newPossession);
});

// Route PUT pour mettre à jour une possession
app.put('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const { dateFin } = req.body;

  console.log('Requête PUT reçue:', req.body); // Débogage

  const index = possessions.findIndex(p => p.libelle === libelle);
  console.log('Index trouvé:', index); // Débogage

  if (index !== -1) {
    possessions[index].dateFin = dateFin;
    console.log('Possession mise à jour:', possessions[index]); // Débogage
    res.json(possessions[index]);
  } else {
    console.log('Possession non trouvée pour:', libelle); // Débogage
    res.status(404).json({ error: 'Possession not found' });
  }
});

// Route DELETE pour supprimer une possession
app.delete('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const index = possessions.findIndex(p => p.libelle === libelle);

  if (index !== -1) {
    possessions.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

// Fonction pour calculer la valeur actuelle d'une possession
const calculateValeurActuelle = (possession, dateActuelle) => {
  const dateDebut = moment(possession.dateDebut);
  let valeurActuelle = possession.valeur;

  if (possession.tauxAmortissement > 0) {
    const dureeUtilisee = dateActuelle.diff(dateDebut, 'years', true);
    valeurActuelle -= (possession.tauxAmortissement / 100) * dureeUtilisee * possession.valeur;
  } else if (possession.valeurConstante && possession.jour) {
    const joursPasses = dateActuelle.diff(dateDebut, 'days');
    const moisPasses = Math.floor(joursPasses / 30);
    valeurActuelle = possession.valeurConstante * moisPasses;
  }

  return Math.max(valeurActuelle, 0);
};

// Route GET pour obtenir la valeur du patrimoine à une date spécifique
app.get('/patrimoine/:date', (req, res) => {
  const { date } = req.params;
  const selectedDate = moment(date);
  let totalValeur = 0;

  possessions.forEach(possession => {
    if (!possession.dateFin || moment(possession.dateFin).isAfter(selectedDate)) {
      totalValeur += calculateValeurActuelle(possession, selectedDate);
    }
  });

  res.json({ date, valeur: totalValeur });
});

// Route POST pour obtenir la valeur du patrimoine sur une plage de dates
app.post('/patrimoine/range', (req, res) => {
  const { dateDebut, dateFin } = req.body;
  const startDate = moment(dateDebut);
  const endDate = moment(dateFin);
  let totalValeur = 0;

  possessions.forEach(possession => {
    if (!possession.dateFin || moment(possession.dateFin).isAfter(endDate)) {
      const currentValue = calculateValeurActuelle(possession, endDate);
      totalValeur += currentValue;
    }
  });

  res.json({ dateDebut, dateFin, valeur: totalValeur });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
