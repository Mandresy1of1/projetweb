import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ListPossession() {
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await fetch('http://localhost:5000/possession');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Data received from API:", data);
        setPossessions(data.possessions); // Assurez-vous que `data.possessions` est la structure correcte
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      await fetch(`http://localhost:5000/possession/${libelle}/close`, { method: 'POST' });
      setPossessions(possessions.filter(possession => possession.libelle !== libelle));
    } catch (error) {
      console.error('Close error:', error);
    }
  };

  const handleDelete = async (libelle) => {
    try {
      await fetch(`http://localhost:5000/possession/${libelle}`, { method: 'DELETE' });
      setPossessions(possessions.filter(possession => possession.libelle !== libelle));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div>
      <Link to="/create">
        <button>Create Possession</button>
      </Link>
      <table>
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
                  <Link to={`/possession/${encodeURIComponent(possession.libelle)}/update`}>Edit</Link>
                  <button onClick={() => handleClose(possession.libelle)}>Close</button>
                  <button onClick={() => handleDelete(possession.libelle)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucune donnée disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListPossession;
