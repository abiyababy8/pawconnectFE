import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import '../App.css';
import goldenRetriever from '../assets/golden-retriever.jpg';
import tabbyCat from '../assets/tabby-cat.jpg';
import beagleDog from '../assets/beagle.jpg';
import persianCat from '../assets/persian-cat.jpg';

// Sample Pet Data (Replace with API later)
const initialPetData = [
    { id: 1, name: 'Buddy', type: 'Dog', image: goldenRetriever, description: 'A friendly golden retriever.', lastFoundLocation: 'Park Avenue', owner: 'John Doe' },
    { id: 2, name: 'Whiskers', type: 'Cat', image: tabbyCat, description: 'A curious and playful tabby cat.', lastFoundLocation: 'Greenwood Street', owner: 'Jane Smith' },
    { id: 3, name: 'Charlie', type: 'Dog', image: beagleDog, description: 'A lovable beagle who loves belly rubs.', lastFoundLocation: 'Sunset Boulevard', owner: 'Mike Johnson' },
    { id: 4, name: 'Luna', type: 'Cat', image: persianCat, description: 'A sleepy but adorable Persian cat.', lastFoundLocation: 'Maple Drive', owner: 'Emily Davis' },
];

function LostPets() {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [pets, setPets] = useState(initialPetData);
    const [showFoundModal, setShowFoundModal] = useState(false);
    const [showLostModal, setShowLostModal] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [foundLocation, setFoundLocation] = useState('');
    const [newLostPet, setNewLostPet] = useState({ name: '', type: '', description: '', owner: '', lastFoundLocation: '', image: '' });
    const [imagePreview, setImagePreview] = useState(null);


    const handleFoundClick = (petId) => {
        setSelectedPetId(petId);
        setShowFoundModal(true);
    };

    const handleFoundSubmit = () => {
        const updatedPets = pets.map(pet =>
            pet.id === selectedPetId ? { ...pet, lastFoundLocation: foundLocation } : pet
        );
        setPets(updatedPets);
        setFoundLocation('');
        setShowFoundModal(false);
    };

    const handleReportLostPet = () => {
        const newPet = {
            ...newLostPet,
            id: pets.length + 1,
            image: goldenRetriever // You can allow file upload later; using a placeholder for now
        };
        setPets([...pets, newPet]);
        setNewLostPet({ name: '', type: '', description: '', owner: '', lastFoundLocation: '', image: '' });
        setShowLostModal(false);
    };

    // Filter Pets
    const filteredPets = selectedFilter === 'All'
        ? pets
        : pets.filter(pet => pet.type === selectedFilter);

    return (
        <Container className="mt-4">
            <h1 className="text-center">Have You Seen Them? 🐾</h1>

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
                                <Card.Text><strong>Last Seen:</strong> {pet.lastFoundLocation}</Card.Text>
                                <Card.Text><strong>Owner:</strong> {pet.owner}</Card.Text>
                                <Button variant="info" onClick={() => handleFoundClick(pet.id)}>Report Found</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Report Lost Pet Button */}
            <div className="text-center mt-4 mb-4">
                <Button variant="warning" onClick={() => setShowLostModal(true)}>Report Lost Pet</Button>
            </div>

            {/* Found Modal */}
            <Modal show={showFoundModal} onHide={() => setShowFoundModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Found Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="foundLocation">
                            <Form.Label>Found Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the location where you found the pet"
                                value={foundLocation}
                                onChange={(e) => setFoundLocation(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFoundModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleFoundSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>

            {/* Report Lost Modal */}
            <Modal show={showLostModal} onHide={() => setShowLostModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Report Lost Pet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="petName">
                            <Form.Label>Pet Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter pet name"
                                value={newLostPet.name}
                                onChange={(e) => setNewLostPet({ ...newLostPet, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="petType" className="mt-2">
                            <Form.Label>Pet Type</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter pet type (Dog/Cat)"
                                value={newLostPet.type}
                                onChange={(e) => setNewLostPet({ ...newLostPet, type: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="petDescription" className="mt-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Enter a brief description"
                                value={newLostPet.description}
                                onChange={(e) => setNewLostPet({ ...newLostPet, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="ownerName" className="mt-2">
                            <Form.Label>Owner Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter owner name"
                                value={newLostPet.owner}
                                onChange={(e) => setNewLostPet({ ...newLostPet, owner: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="lastLocation" className="mt-2">
                            <Form.Label>Last Known Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last known location"
                                value={newLostPet.lastFoundLocation}
                                onChange={(e) => setNewLostPet({ ...newLostPet, lastFoundLocation: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="petImage" className="mt-2">
                            <Form.Label>Upload Image of the Pet</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setNewLostPet({ ...newLostPet, image: file });
                                    if (file) {
                                        setImagePreview(URL.createObjectURL(file));
                                    } else {
                                        setImagePreview(null);
                                    }
                                }}
                            />
                            {newLostPet.image && (
                                <>
                                    <Form.Text className="text-muted">
                                        Selected file: {newLostPet.image.name}
                                    </Form.Text>
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                </>
                            )}
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLostModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleReportLostPet}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default LostPets;
