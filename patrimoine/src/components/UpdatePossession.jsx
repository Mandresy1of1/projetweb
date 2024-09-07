import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

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
      await fetch(`http://localhost:5000/possession/${libelle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      navigate('/possession'); // Rediriger après la mise à jour
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Update Possession</h2>
      {possession && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formLibelle">
            <Form.Label>Libellé</Form.Label>
            <Form.Control
              type="text"
              name="libelle"
              value={formData.libelle}
              onChange={handleChange}
              placeholder="Libellé"
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="formValeur">
            <Form.Label>Valeur</Form.Label>
            <Form.Control
              type="number"
              name="valeur"
              value={formData.valeur}
              onChange={handleChange}
              placeholder="Valeur"
            />
          </Form.Group>
          <Form.Group controlId="formDateDebut">
            <Form.Label>Date Début</Form.Label>
            <Form.Control
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDateFin">
            <Form.Label>Date Fin</Form.Label>
            <Form.Control
              type="date"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTaux">
            <Form.Label>Taux d'Amortissement (%)</Form.Label>
            <Form.Control
              type="number"
              name="tauxAmortissement"
              value={formData.tauxAmortissement}
              onChange={handleChange}
              placeholder="Taux d'Amortissement"
            />
          </Form.Group>
          <Form.Group controlId="formValeurConstante">
            <Form.Label>Valeur Constante</Form.Label>
            <Form.Control
              type="number"
              name="valeurConstante"
              value={formData.valeurConstante}
              onChange={handleChange}
              placeholder="Valeur Constante"
            />
          </Form.Group>
          <Form.Group controlId="formJour">
            <Form.Label>Jour</Form.Label>
            <Form.Control
              type="text"
              name="jour"
              value={formData.jour}
              onChange={handleChange}
              placeholder="Jour"
            />
          </Form.Group>
          <Button variant="primary" type="submit">Update</Button>
        </Form>
      )}
    </Container>
  );
}

export default UpdatePossession;
