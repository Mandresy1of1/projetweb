import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line } from 'react-chartjs-2';

const Patrimoine = () => {
  const [date, setDate] = useState(null); // Pour calculer la valeur à une date spécifique
  const [dateRanges, setDateRanges] = useState([{ dateDebut: null, dateFin: null }]); // Plage de dates
  const [jour, setJour] = useState(null); // Sélection du jour
  const [chartData, setChartData] = useState({}); // Données du graphique
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRangeChange = (index, field, value) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index][field] = value;
    setDateRanges(newDateRanges);
  };

  const handleAddRange = () => {
    setDateRanges([...dateRanges, { dateDebut: null, dateFin: null }]);
  };

  const handleValidateRanges = () => {
    // Votre logique pour valider les plages de dates et récupérer les données du graphique
  };

  return (
    <div>
      <h2>Graphique de Valeur des Possessions</h2>

      <div className="mb-3">
        <label>Date pour calculer la valeur :</label>
        <DatePicker
          selected={date}
          onChange={date => setDate(date)}
          className="form-control"
          placeholderText="Sélectionner une date"
        />
      </div>

      <h4>Plage de dates pour le graphique :</h4>
      {dateRanges.map((range, index) => (
        <div key={index} className="d-flex mb-3">
          <DatePicker
            selected={range.dateDebut}
            onChange={date => handleRangeChange(index, 'dateDebut', date)}
            selectsStart
            startDate={range.dateDebut}
            endDate={range.dateFin}
            className="form-control mr-2"
            placeholderText="Date de début"
          />
          <DatePicker
            selected={range.dateFin}
            onChange={date => handleRangeChange(index, 'dateFin', date)}
            selectsEnd
            startDate={range.dateDebut}
            endDate={range.dateFin}
            className="form-control"
            placeholderText="Date de fin"
          />
        </div>
      ))}

      <button onClick={handleAddRange} className="btn btn-primary mb-3">Ajouter une plage</button>
      
      <div className="mb-3">
        <label>Jour:</label>
        <input
          type="number"
          value={jour}
          onChange={e => setJour(e.target.value)}
          className="form-control"
          placeholder="Sélectionner un jour"
        />
      </div>

      <button onClick={handleValidateRanges} className="btn btn-success mb-3">Valider</button>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Chargement...</div>}

      <div>
        <Line data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Patrimoine;
