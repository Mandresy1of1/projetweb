import { useState } from 'react';
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Button, Container } from 'react-bootstrap';

function CreatePossession() {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState(0);
  const [dateDebut, setDateDebut] = useState(new Date());
  const [taux, setTaux] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/possession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle, valeur, dateDebut, taux })
    });
    navigate('/possession'); // Rediriger après la création
  };

  return (
    <Container className="mt-4">
      <h2>Create Possession</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libellé</Form.Label>
          <Form.Control
            type="text"
            value={libelle}
            onChange={e => setLibelle(e.target.value)}
            placeholder="Libellé"
          />
        </Form.Group>
        <Form.Group controlId="formValeur">
          <Form.Label>Valeur</Form.Label>
          <Form.Control
            type="number"
            value={valeur}
            onChange={e => setValeur(e.target.value)}
            placeholder="Valeur"
          />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date Début</Form.Label>
          <DatePicker
            selected={dateDebut}
            onChange={date => setDateDebut(date)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formTaux">
          <Form.Label>Taux d'Amortissement (%)</Form.Label>
          <Form.Control
            type="number"
            value={taux}
            onChange={e => setTaux(e.target.value)}
            placeholder="Taux d'Amortissement"
          />
        </Form.Group>
        <Button variant="primary" type="submit">Create</Button>
      </Form>
    </Container>
  );
}

export default CreatePossession;
