import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import '../App.css';
import goldenRetriever from '../assets/golden-retriever.jpg';
import tabbyCat from '../assets/tabby-cat.jpg';
import beagleDog from '../assets/beagle.jpg';
import persianCat from '../assets/persian-cat.jpg';

// Sample Pet Data (Replace with API later)
const initialPetData = [
  { id: 1, name: 'Buddy', type: 'Dog', image: goldenRetriever, description: 'A friendly golden retriever.', owner: 'John Doe', lastLocation: 'Central Park' },
  { id: 2, name: 'Whiskers', type: 'Cat', image: tabbyCat, description: 'A curious and playful tabby cat.', owner: 'Jane Smith', lastLocation: 'Maple Street' },
  { id: 3, name: 'Charlie', type: 'Dog', image: beagleDog, description: 'A lovable beagle who loves belly rubs.', owner: 'Emily Johnson', lastLocation: 'River Side' },
  { id: 4, name: 'Luna', type: 'Cat', image: persianCat, description: 'A sleepy but adorable Persian cat.', owner: 'Michael Brown', lastLocation: 'Oak Avenue' },
];

function Pets() {
  const [petData, setPetData] = useState(initialPetData);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [newPet, setNewPet] = useState({ name: '', type: '', description: '', owner: '', lastLocation: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  // Filter Pets
  const filteredPets = selectedFilter === 'All'
    ? petData
    : petData.filter(pet => pet.type === selectedFilter);

  // Handle adopt button click
  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setShowAdoptModal(true);
  };

  // Handle Add New Pet
  const handleAddNewPet = () => {
    const newPetWithId = { ...newPet, id: petData.length + 1 };
    setPetData([...petData, newPetWithId]);
    //setNewPet({ name: '', type: '', description: '', owner: '', lastLocation: '', image: '' });
    setShowAddPetModal(false);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Available Pets for Adoption 🐾</h1>

      {/* Filter Buttons */}
      <div className="text-center mb-4">
        <Button variant="primary" className="m-1" onClick={() => setSelectedFilter('All')}>All</Button>
        <Button variant="success" className="m-1" onClick={() => setSelectedFilter('Dog')}>Dogs</Button>
        <Button variant="warning" className="m-1" onClick={() => setSelectedFilter('Cat')}>Cats</Button>
      </div>

      {/* Pets List */}
      <Row>
        {filteredPets.map((pet) => (
          <Col key={pet.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Img variant="top" src={pet.image} className="pet-card-image" style={{ position: 'relative' }} />
              <Card.Body className="text-center">
                <Card.Title>{pet.name}</Card.Title>
                <Card.Text>{pet.description.slice(0, 28)}...</Card.Text>
                <Card.Text><strong>Owner:</strong> {pet.owner}</Card.Text>
                <Card.Text><strong>Location:</strong> {pet.lastLocation}</Card.Text>
                <Button variant="info" onClick={() => handleAdoptClick(pet)}>Adopt</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add New Pet Button */}
      <div className="text-center mt-4 mb-4">
        <Button variant="warning" onClick={() => setShowAddPetModal(true)}>
          Add New Pet for Adoption
        </Button>
      </div>

      {/* Adopt Modal */}
      <Modal show={showAdoptModal} onHide={() => setShowAdoptModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adopt {selectedPet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>

            <Form.Group controlId="formContact" className="mt-3">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control type="text" placeholder="Enter your contact details" />
            </Form.Group>

            {/* Optional Donation Field */}
            <Form.Group controlId="formDonation" className="mt-4">
              <Form.Label>Support Our Rescue Efforts</Form.Label>
              <Form.Control type="number" placeholder="Enter donation amount (₹)" min="100" />
              <Form.Text className="text-muted">
                Your support helps cover food, vaccinations, and rescue operations. ❤️
              </Form.Text>
            </Form.Group>

            <Button variant="primary" className="mt-4" onClick={() => setShowAdoptModal(false)}>
              Submit Adoption Request
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* Add New Pet Modal */}
      <Modal show={showAddPetModal} onHide={() => setShowAddPetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Pet for Adoption</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPetName">
              <Form.Label>Pet Name</Form.Label>
              <Form.Control type="text" placeholder="Enter pet name" value={newPet.name} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formPetType" className="mt-3">
              <Form.Label>Pet Type</Form.Label>
              <Form.Control as="select" value={newPet.type} onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}>
                <option>Dog</option>
                <option>Cat</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Short description" value={newPet.description} onChange={(e) => setNewPet({ ...newPet, description: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formOwner" className="mt-3">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control type="text" placeholder="Owner's name" value={newPet.owner} onChange={(e) => setNewPet({ ...newPet, owner: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" placeholder="Current Location of the pet" value={newPet.lastLocation} onChange={(e) => setNewPet({ ...newPet, lastLocation: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                placeholder="Image of the Pet"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewPet({ ...newPet, image: file });
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  } else {
                    setImagePreview(null);
                  }
                }}
              />
              {newPet.image && (
                <>
                  <Form.Text className="text-muted">
                    Selected file: {newPet.image.name}
                  </Form.Text>
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Pet Preview"
                      style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                </>
              )}
            </Form.Group>

            <Button variant="success" className="mt-3" onClick={handleAddNewPet}>
              Add Pet
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Pets;
