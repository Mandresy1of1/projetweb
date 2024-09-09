import express from 'express';
import cors from 'cors';
import moment from 'moment';
import data from './data.json' assert { type: 'json' };
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',  // Permettre toutes les origines; modifier si tu veux restreindre
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

const possessions = data.find(item => item.model === 'Patrimoine')?.data.possessions || [];

// Endpoints pour gérer les possessions
app.get('/possession', (req, res) => {
  res.json(possessions);
});

app.get('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === decodeURIComponent(libelle));
  if (possession) {
    res.json(possession);
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

app.post('/possession', (req, res) => {
  const { possesseur, libelle, valeur, dateDebut, tauxAmortissement, dateFin, jour, valeurConstante } = req.body;
  const newPossession = { possesseur, libelle, valeur, dateDebut, tauxAmortissement, dateFin, jour, valeurConstante };
  possessions.push(newPossession);
  res.status(201).json(newPossession);
});

app.put('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const updatedData = req.body;

  // Recherche de la possession par l'ancien libelle
  const possession = possessions.find(p => p.libelle === libelle);

  if (possession) {
    // Mise à jour de la possession avec les nouvelles données
    possession.libelle = updatedData.libelle || possession.libelle;
    possession.valeur = updatedData.valeur;
    possession.dateDebut = updatedData.dateDebut;
    possession.dateFin = updatedData.dateFin;
    possession.tauxAmortissement = updatedData.tauxAmortissement;
    possession.valeurConstante = updatedData.valeurConstante;
    possession.jour = updatedData.jour;

    res.json(possession);
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

app.delete('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const index = possessions.findIndex(p => p.libelle === decodeURIComponent(libelle));

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

// Endpoint pour obtenir la valeur du patrimoine pour une plage de dates
app.post('/patrimoine/ranges', (req, res) => {
  const { dateRanges, jour } = req.body;
  const result = [];

  dateRanges.forEach(range => {
    const startDate = moment(range.dateDebut);
    const endDate = moment(range.dateFin);
    let totalValeur = 0;

    possessions.forEach(possession => {
      if (!possession.dateFin || moment(possession.dateFin).isAfter(endDate)) {
        const currentValue = calculateValeurActuelle(possession, endDate);
        totalValeur += currentValue;
      }
    });

    result.push({
      dateDebut: startDate.format('YYYY-MM-DD'),
      dateFin: endDate.format('YYYY-MM-DD'),
      valeur: totalValeur
    });
  });

  res.json(result);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
