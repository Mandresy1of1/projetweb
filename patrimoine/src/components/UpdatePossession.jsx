import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdatePossession() {
  const { libelle } = useParams(); // Obtenir le libelle de la route
  const [possession, setPossession] = useState(null);
  const [formData, setFormData] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: '',
    valeurConstante: '',
    jour: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        const response = await fetch(`http://localhost:5000/possession/${libelle}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPossession(data);
        // Pré-remplir le formulaire avec les données existantes
        setFormData({
          libelle: data.libelle,
          valeur: data.valeur,
          dateDebut: data.dateDebut.split('T')[0], // Convertir en format YYYY-MM-DD
          dateFin: data.dateFin ? data.dateFin.split('T')[0] : '',
          tauxAmortissement: data.tauxAmortissement,
          valeurConstante: data.valeurConstante || '',
          jour: data.jour || ''
        });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchPossession();
  }, [libelle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/possession/${formData.libelle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      navigate('/tableau'); // Rediriger après la mise à jour
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!possession) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Possession</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Libellé</label>
          <input
            type="text"
            name="libelle"
            value={formData.libelle}
            onChange={handleChange}
            disabled // Vous pouvez enlever l'attribut disabled si vous souhaitez permettre de modifier le libelle
          />
        </div>
        <div>
          <label>Valeur</label>
          <input
            type="number"
            name="valeur"
            value={formData.valeur}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date Début</label>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date Fin</label>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Taux d'Amortissement (%)</label>
          <input
            type="number"
            name="tauxAmortissement"
            value={formData.tauxAmortissement}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Valeur Constante</label>
          <input
            type="number"
            name="valeurConstante"
            value={formData.valeurConstante}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Jour</label>
          <input
            type="text"
            name="jour"
            value={formData.jour}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdatePossession;
