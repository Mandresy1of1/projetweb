import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreatePossession from './components/CreatePossession';
import UpdatePossession from './components/UpdatePossession';
import ListPossession from './components/ListPossession';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">List Possessions</Nav.Link>
            <Nav.Link as={Link} to="/possession/create">Create Possession</Nav.Link>
          </Nav>
        </Navbar>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<ListPossession />} />
            <Route path="/possession/create" element={<CreatePossession />} />
            <Route path="/possession/:libelle/update" element={<UpdatePossession />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
