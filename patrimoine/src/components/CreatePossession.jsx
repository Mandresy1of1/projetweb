import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function CreatePossession() {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState(new Date());
  const [taux, setTaux] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!libelle || !valeur || isNaN(valeur) || !dateDebut || isNaN(taux)) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/possession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libelle, valeur: parseFloat(valeur), dateDebut, taux: parseFloat(taux) })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSuccess('Possession created successfully!');
      setLibelle('');
      setValeur('');
      setDateDebut(new Date());
      setTaux('');
      setTimeout(() => navigate('/possession'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError('Failed to create possession. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Possession</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libellé</Form.Label>
          <Form.Control
            type="text"
            value={libelle}
            onChange={e => setLibelle(e.target.value)}
            placeholder="Libellé"
            required
          />
        </Form.Group>
        <Form.Group controlId="formValeur">
          <Form.Label>Valeur</Form.Label>
          <Form.Control
            type="number"
            value={valeur}
            onChange={e => setValeur(e.target.value)}
            placeholder="Valeur"
            min="0"
            step="any"
            required
          />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date Début</Form.Label>
          <DatePicker
            selected={dateDebut}
            onChange={date => setDateDebut(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            required
          />
        </Form.Group>
        <Form.Group controlId="formTaux">
          <Form.Label>Taux d'Amortissement (%)</Form.Label>
          <Form.Control
            type="number"
            value={taux}
            onChange={e => setTaux(e.target.value)}
            placeholder="Taux d'Amortissement"
            min="0"
            step="any"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Create</Button>
      </Form>
    </Container>
  );
}

export default CreatePossession;
