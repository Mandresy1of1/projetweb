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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [possessions, setPossessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [patrimoineValeurDate, setPatrimoineValeurDate] = useState(null);
  const [patrimoineValeurPlage, setPatrimoineValeurPlage] = useState(null);
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
        const response = await fetch("http://localhost:8000/possession");
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

  const calculerValeurPatrimoine = (possessions, dateFin) => {
    const dateActuelle = moment(dateFin);
    let totalValeur = 0;

    const possessionsAvecValeurActuelle = possessions.map(item => {
      const valeurActuelle = calculerValeurActuelle(item, dateActuelle);
      totalValeur += valeurActuelle;
      return { ...item, valeurActuelle };
    });

    setPossessions(possessionsAvecValeurActuelle);
    setPatrimoineValeurDate(totalValeur);
    updateChart(possessionsAvecValeurActuelle, 'date');
  };

  const calculerValeurPatrimoinePlage = (possessions, dateDebut, dateFin) => {
    const possessionsAvecValeurActuelle = possessions.map(item => {
      const valeurActuelle = calculerValeurActuelle(item, dateFin);
      return { ...item, valeurActuelle };
    });

    setPossessions(possessionsAvecValeurActuelle);
    const totalValeur = possessionsAvecValeurActuelle.reduce((acc, item) => acc + item.valeurActuelle, 0);
    setPatrimoineValeurPlage(totalValeur);
    updateChart(possessionsAvecValeurActuelle, 'range');
  };

  const updateChart = (possessions, type) => {
    const labels = possessions.map(p => p.libelle);
    const data = possessions.map(p => p.valeurActuelle);

    if (type === 'date') {
      setChartDataDate({
        labels,
        datasets: [
          {
            label: 'Valeur des Possessions à la Date Spécifique',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          }
        ]
      });
    } else if (type === 'range') {
      setChartDataRange({
        labels,
        datasets: [
          {
            label: 'Valeur des Possessions dans la Plage de Dates',
            data,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ]
      });
    }
  };

  const handleValidation = () => {
    calculerValeurPatrimoine(possessions, moment(selectedDate));
  };

  const handleValidateRange = () => {
    if (dateDebut && dateFin) {
      calculerValeurPatrimoinePlage(possessions, moment(dateDebut), moment(dateFin));
    }
  };

  return (
    <Router>
      <div className="container">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/tableau">Tableau</Nav.Link>
            <Nav.Link as={Link} to="/graphique">Graphique</Nav.Link>
            <Nav.Link as={Link} to="/possession/create">Create Possession</Nav.Link>
          </Nav>
        </Navbar>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<div>Welcome to the Home Page</div>} />
            <Route path="/tableau" element={<ListPossession />} />
            <Route path="/graphique" element={
              <div className="chart-container">
                <h3>Graphique de Valeur des Possessions</h3>

                {/* Date pour calculer la valeur */}
                <div className="date-single mt-3">
                  <label>Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="control ml-2"
                  />
                  <button className="btn btn-primary ml-2" onClick={handleValidation}>Valider</button>
                </div>
                {patrimoineValeurDate !== null && (
                  <p className="mt-3">La valeur du patrimoine à la date sélectionnée est : <strong>{patrimoineValeurDate.toFixed(2)}</strong></p>
                )}

                {/* Plage de dates */}
                <div className="date-range mt-3">
                  <div className="date-range-item">
                    <label>Date Début</label>
                    <DatePicker
                      selected={dateDebut}
                      onChange={(date) => setDateDebut(date)}
                      dateFormat="yyyy-MM-dd"
                      className="control ml-2"
                    />
                  </div>
                  <div className="date-range-item">
                    <label>Date Fin</label>
                    <DatePicker
                      selected={dateFin}
                      onChange={(date) => setDateFin(date)}
                      dateFormat="yyyy-MM-dd"
                      className="control ml-2"
                    />
                  </div>
                  <button className="btn btn-primary ml-2" onClick={handleValidateRange}>Valider Plage</button>
                </div>
                {patrimoineValeurPlage !== null && (
                  <p className="mt-3">La valeur du patrimoine entre ces dates est : <strong>{patrimoineValeurPlage.toFixed(2)}</strong></p>
                )}

                {/* Graphique pour une date spécifique */}
                <div className="chart-date mt-5">
                  <h4>Valeur des Possessions à la Date Spécifique</h4>
                  <Line data={chartDataDate} />
                </div>

                {/* Graphique pour la plage de dates */}
                <div className="chart-range mt-5">
                  <h4>Valeur des Possessions dans la Plage de Dates</h4>
                  <Line data={chartDataRange} />
                </div>
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
