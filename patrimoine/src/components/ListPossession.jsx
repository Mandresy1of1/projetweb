import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Container } from 'react-bootstrap';
import PossessionContext from './PossessionContext';

function ListPossession() {
  const { possessions, fetchPossessions } = useContext(PossessionContext);

  const handleClose = async (libelle) => {
    try {
      await fetch(`http://localhost:5000/possession/${libelle}/close`, { method: 'POST' });
      fetchPossessions(); // Rafraîchir les données après fermeture
    } catch (error) {
      console.error('Close error:', error);
    }
  };

  const handleDelete = async (libelle) => {
    try {
      await fetch(`http://localhost:5000/possession/${libelle}`, { method: 'DELETE' });
      fetchPossessions(); // Rafraîchir les données après suppression
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Link to="/create">
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
          {possessions.length > 0 ? (
            possessions.map(possession => (
              <tr key={possession.libelle}>
                <td>{possession.libelle}</td>
                <td>{possession.valeur}</td>
                <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
                <td>{possession.tauxAmortissement}%</td>
                <td>{possession.valeurActuelle}</td>
                <td>
                  <Link to={`/possession/${encodeURIComponent(possession.libelle)}/update`}>
                    <Button variant="warning" className="mr-2">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleClose(possession.libelle)} className="mr-2">Close</Button>
                  <Button variant="danger" onClick={() => handleDelete(possession.libelle)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucune donnée disponible</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default ListPossession;
