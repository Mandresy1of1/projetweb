import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ListPossession from './components/ListPossession';
import CreatePossession from './components/CreatePossession';
import UpdatePossession from './components/UpdatePossession';
import './App.css'; // Assurez-vous d'importer le CSS

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [possessions, setPossessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [patrimoineValeurDate, setPatrimoineValeurDate] = useState(null);
  const [patrimoineValeurRange, setPatrimoineValeurRange] = useState(null);
  const [chartDataDate, setChartDataDate] = useState({
    labels: [],
    datasets: []
  });
  const [chartDataRange, setChartDataRange] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await fetch("http://localhost:8000/possession"); // Assurez-vous que cela correspond à l'URL de votre serveur
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPossessions(data || []);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchPossessions();
  }, []);

  const calculerValeurActuelle = (possession, dateActuelle) => {
    const dateDebut = moment(possession.dateDebut);
    let valeurActuelle = possession.valeur;

    if (dateActuelle.isBefore(dateDebut)) {
      return 0;
    }
  
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

  const calculerValeurPatrimoineDate = (possessions, dateFin) => {
    const dateActuelle = moment(dateFin);
    let totalValeur = 0;

    const possessionsAvecValeurActuelle = possessions.map(item => {
      const valeurActuelle = calculerValeurActuelle(item, dateActuelle);
      totalValeur += valeurActuelle;
      return { ...item, valeurActuelle };
    });

    setPossessions(possessionsAvecValeurActuelle);
    setPatrimoineValeurDate(totalValeur);
    updateChartDate(possessionsAvecValeurActuelle); // Mise à jour des données du graphique
  };

  const calculerValeurPatrimoineRange = (possessions, dateDebut, dateFin) => {
    const dateDebutActuelle = moment(dateDebut);
    const dateFinActuelle = moment(dateFin);
    let totalValeur = 0;

    const possessionsAvecValeurActuelle = possessions.map(item => {
      const valeurActuelle = calculerValeurActuelle(item, dateFinActuelle);
      totalValeur += valeurActuelle;
      return { ...item, valeurActuelle };
    });

    setPossessions(possessionsAvecValeurActuelle);
    setPatrimoineValeurRange(totalValeur);
    updateChartRange(possessionsAvecValeurActuelle); // Mise à jour des données du graphique
  };

  const updateChartDate = (possessions) => {
    const labels = possessions.map(p => p.libelle);
    const data = possessions.map(p => p.valeurActuelle);

    setChartDataDate({
      labels,
      datasets: [
        {
          label: 'Valeur des Possessions à une Date',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }
      ]
    });
  };

  const updateChartRange = (possessions) => {
    const labels = possessions.map(p => p.libelle);
    const data = possessions.map(p => p.valeurActuelle);

    setChartDataRange({
      labels,
      datasets: [
        {
          label: 'Valeur des Possessions entre Dates',
          data,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
        }
      ]
    });
  };

  const handleValidationDate = () => {
    calculerValeurPatrimoineDate(possessions, selectedDate); // Calculer lorsque le bouton est cliqué
  };

  const handleValidationRange = () => {
    calculerValeurPatrimoineRange(possessions, dateDebut, dateFin); // Calculer lorsque le bouton est cliqué
  };

  return (
    <Router>
      <div className="container">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/tableau">Possession</Nav.Link>
            <Nav.Link as={Link} to="/graphique">PATRIMOINE</Nav.Link>
            <Nav.Link as={Link} to="/possession/create">Create Possession</Nav.Link>
          </Nav>
        </Navbar>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<div>WEB 2 PATRIMOINE APP</div>} />
            <Route path="/tableau" element={<ListPossession />} />
            <Route path="/graphique" element={
              <div className="chart-container">
                <h3>Graphique de Valeur à une Date</h3>
                <div className="date-single">
                  <label>Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="control"
                  />
                  <button className="btn btn-primary" onClick={handleValidationDate}>Valider</button>
                </div>
                <div className="chart-date">
                  <Line data={chartDataDate} />
                </div>
                {patrimoineValeurDate !== null && (
                  <p className="mt-3">La valeur du patrimoine à cette date est : <strong>{patrimoineValeurDate.toFixed(2)}</strong></p>
                )}
                <h3>Graphique de Valeur entre Dates</h3>
                <div className="date-range">
                  <div className="date-range-item">
                    <label>Date Début</label>
                    <DatePicker
                      selected={dateDebut}
                      onChange={(date) => setDateDebut(date)}
                      dateFormat="yyyy-MM-dd"
                      className="control"
                    />
                  </div>
                  <div className="date-range-item">
                    <label>Date Fin</label>
                    <DatePicker
                      selected={dateFin}
                      onChange={(date) => setDateFin(date)}
                      dateFormat="yyyy-MM-dd"
                      className="control"
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleValidationRange}>Valider</button>
                </div>
                <div className="chart-range">
                  <Line data={chartDataRange} />
                </div>
                {patrimoineValeurRange !== null && (
                  <p className="mt-3">La valeur du patrimoine entre ces dates est : <strong>{patrimoineValeurRange.toFixed(2)}</strong></p>
                )}
              </div>
            } />
            <Route path="/possession/create" element={<CreatePossession />} />
            <Route path="/possession/:libelle/update" element={<UpdatePossession />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
