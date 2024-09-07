import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import PossessionContext from './PossessionContext';

function UpdatePossession() {
  const { libelle } = useParams();
  const { fetchPossessions } = useContext(PossessionContext);
  const [formData, setFormData] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: '',
    valeurConstante: '',
    jour: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        const response = await fetch(`http://localhost:8000/possession/${libelle}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData({
          libelle: data.libelle,
          valeur: data.valeur,
          dateDebut: data.dateDebut ? data.dateDebut.split('T')[0] : '',
          dateFin: data.dateFin ? data.dateFin.split('T')[0] : '',
          tauxAmortissement: data.tauxAmortissement,
          valeurConstante: data.valeurConstante || '',
          jour: data.jour || ''
        });
      } catch (error) {
        setError('Failed to fetch possession details');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
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
      await fetch(`http://localhost:8000/possession/${libelle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateDebut: formData.dateDebut ? new Date(formData.dateDebut).toISOString() : null,
          dateFin: formData.dateFin ? new Date(formData.dateFin).toISOString() : null,
          valeur: parseFloat(formData.valeur) || 0,
          tauxAmortissement: parseFloat(formData.tauxAmortissement) || 0,
          valeurConstante: parseFloat(formData.valeurConstante) || 0,
          jour: formData.jour
        })
      });
      fetchPossessions(); // Refresh the data in context
      navigate('/possession'); // Redirect to the list after update
    } catch (error) {
      setError('Failed to update possession');
      console.error('Update error:', error);
    }
  };

  if (loading) {
    return <Container className="mt-4"><p>Loading...</p></Container>;
  }

  return (
    <Container className="mt-4">
      <h2>Update Possession</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libellé</Form.Label>
          <Form.Control
            type="text"
            name="libelle"
            value={formData.libelle}
            onChange={handleChange}
            placeholder="Libellé"
            required
            readOnly // libelle is typically not editable
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
            min="0"
            step="0.01"
            required
          />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date Début</Form.Label>
          <Form.Control
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
            required
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
          <Form.Label>Taux</Form.Label>
          <Form.Control
            type="number"
            name="tauxAmortissement"
            value={formData.tauxAmortissement}
            onChange={handleChange}
            placeholder="Taux d'Amortissement"
            min="0"
            step="0.01"
            required
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
            min="0"
            step="0.01"
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
        <Button variant="primary" type="submit" className="mt-3">Update</Button>
      </Form>
    </Container>
  );
}

export default UpdatePossession;
