import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function UpdatePossession() {
  const [libelle, setLibelle] = useState('');
  const [dateFin, setDateFin] = useState('');
  const { libelle: libelleParam } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        const response = await fetch(`http://localhost:5000/possession/${libelleParam}`);
        const data = await response.json();
        setLibelle(data.libelle);
        setDateFin(data.dateFin || '');
      } catch (error) {
        console.error('Error fetching possession:', error);
      }
    };

    fetchPossession();
  }, [libelleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5000/possession/${libelleParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libelle, dateFin }),
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating possession:', error);
    }
  };

  return (
    <div>
      <h2>Update Possession</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libellé</Form.Label>
          <Form.Control type="text" value={libelle} readOnly />
        </Form.Group>
        <Form.Group controlId="formDateFin">
          <Form.Label>Date Fin</Form.Label>
          <Form.Control type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">Update</Button>
      </Form>
    </div>
  );
}

export default UpdatePossession;
