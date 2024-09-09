import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Container } from 'react-bootstrap';
import axios from 'axios';

function ListPossession() {
  const [possessions, setPossessions] = useState([]);

  // Fonction pour récupérer les possessions depuis l'API
  const fetchPossessions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/possession');
      setPossessions(res.data);
    } catch (error) {
      console.error('Error fetching possessions:', error);
    }
  };

  useEffect(() => {
    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      await axios.post(`http://localhost:8000/possession/${libelle}/close`);
      fetchPossessions(); // Rafraîchir les données après fermeture
    } catch (error) {
      console.error('Close error:', error);
    }
  };

  const handleDelete = async (libelle) => {
    try {
      await axios.delete(`http://localhost:8000/possession/${libelle}`);
      fetchPossessions(); // Rafraîchir les données après suppression
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Link to="/possession/create">
        <Button variant="primary" className="mb-3">Nouvelle Possession</Button>
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
