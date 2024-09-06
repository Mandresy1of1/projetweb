import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function CreatePossession() {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [tauxAmortissement, setTauxAmortissement] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPossession = { libelle, valeur, dateDebut, tauxAmortissement };

    try {
      await fetch('http://localhost:5000/possession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPossession),
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating possession:', error);
    }
  };

  return (
    <div>
      <h2>Create Possession</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libellé</Form.Label>
          <Form.Control type="text" value={libelle} onChange={(e) => setLibelle(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="formValeur">
          <Form.Label>Valeur</Form.Label>
          <Form.Control type="number" value={valeur} onChange={(e) => setValeur(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date Début</Form.Label>
          <Form.Control type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="formTauxAmortissement">
          <Form.Label>Taux Amortissement</Form.Label>
          <Form.Control type="number" value={tauxAmortissement} onChange={(e) => setTauxAmortissement(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">Create</Button>
      </Form>
    </div>
  );
}

export default CreatePossession;
