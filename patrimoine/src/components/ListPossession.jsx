import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

function ListPossession() {
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await fetch('http://localhost:5000/possession');
        const data = await response.json();

        if (!Array.isArray(data.possessions)) {
          throw new Error('Expected an array but received ' + typeof data.possessions);
        }

        setPossessions(data.possessions);
        console.log('Data received from API:', data);
      } catch (error) {
        console.error('Error fetching possessions:', error);
      }
    };
    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    await fetch(`http://localhost:5000/possession/${libelle}/close`, { method: 'POST' });
    setPossessions(possessions.filter(possession => possession.libelle !== libelle));
  };

  const handleDelete = async (libelle) => {
    await fetch(`http://localhost:5000/possession/${libelle}`, { method: 'DELETE' });
    setPossessions(possessions.filter(possession => possession.libelle !== libelle));
  };

  return (
    <div>
      <h2>List of Possessions</h2>
      <Link to="/possession/create">
        <Button variant="primary" className="mb-3">Create Possession</Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux</th>
            <th>Valeur Actuelle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map(possession => (
            <tr key={possession.id}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
              <td>{possession.tauxAmortissement}%</td>
              <td>{possession.valeurActuelle}</td>
              <td>
                <Link to={`/possession/${possession.libelle}/update`}><Button variant="warning" size="sm">Edit</Button></Link>{' '}
                <Button variant="success" size="sm" onClick={() => handleClose(possession.libelle)}>Close</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(possession.libelle)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ListPossession;
