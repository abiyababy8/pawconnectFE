import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import '../App.css';
import { addLostPetApi, getLostPetApi, updateLostPetLocationApi } from '../services/allApi';
import { toast } from 'react-toastify';
import { base_url } from '../services/base_url';
import { Link } from 'react-router-dom';

function LostPets() {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [showFoundModal, setShowFoundModal] = useState(false);
    const [showLostModal, setShowLostModal] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [foundLocation, setFoundLocation] = useState('');
    const user=sessionStorage.getItem("user")
    const [newLostPet, setNewLostPet] = useState({
        name: '',
        type: '',
        description: '',
        owner: user.username,
        location: '',
        lostPetImage: '',
        status: 'Not Found'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [pets, setPets] = useState([]); 

    const handleFoundClick = (petId) => {
        setSelectedPetId(petId);
        setShowFoundModal(true);
    };

    const handleFoundSubmit = async () => {
        if (!foundLocation) {
            toast.warning("Please enter the location.");
            return;
        }

        const token = sessionStorage.getItem("token");
        const reqHeader = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            const result = await updateLostPetLocationApi(selectedPetId, foundLocation, reqHeader);
            toast.success("Location updated successfully!", result);

            // Refresh list to reflect changes
            getLostPet();
            setFoundLocation('');
            setShowFoundModal(false);
        } catch (error) {
            toast.error("Failed to update location.");
            console.error(error);
        }
    };


    const handleReportLostPet = async () => {
        const { name, type, description, owner, location, lostPetImage, status } = newLostPet;
        if (!name || !type || !description || !owner || !location || !lostPetImage) {
            toast.warning("Please fill out all fields before submitting.");
            return;
        }

        const reqBody = new FormData();
        reqBody.append("name", name);
        reqBody.append("type", type);
        reqBody.append("description", description);
        reqBody.append("owner", owner);
        reqBody.append("location", location);
        reqBody.append("lostPetImage", lostPetImage);
        reqBody.append("status", status);

        const token = sessionStorage.getItem("token");
        const reqHeader = {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        };

        try {
            const result = await addLostPetApi(reqBody, reqHeader);
            console.log("Lost Pet Reported:", result);
            toast.success("Lost pet reported successfully!");
            getLostPet();
            setNewLostPet({
                name: '', type: '', description: '', owner: user.username, location: '', lostPetImage: ''
            });
            setImagePreview(null);
            setShowLostModal(false);
        } catch (error) {
            toast.error("Something went wrong while reporting the lost pet.");
            console.error("Error:", error);
        }
    };

    const getLostPet = async () => {
        const token = sessionStorage.getItem("token");
        const requestHeader = {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`
        };

        try {
            const result = await getLostPetApi(requestHeader);
            console.log("Lost Pets:", result.data);
            setPets(result.data);
        } catch (error) {
            console.error("Failed to fetch lost pets:", error);
        }
    };

    useEffect(() => {
        getLostPet();
    }, []);

    // Filtered pets
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
            <Row className='justify-content-center'>
                {filteredPets.length > 0 ? filteredPets.map((pet) => (
                    <Col key={pet._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Img variant="top" src={`${base_url}/uploads/${pet.lostPetImage}`} className="pet-card-image" />
                            <Card.Body className="text-center">
                                <Card.Title>{pet.name}</Card.Title>
                                <Card.Text>{pet.description?.slice(0, 28)}...</Card.Text>
                                <Card.Text><strong>Last Seen:</strong> {pet.location}</Card.Text>
                                <Card.Text><strong>Owner:</strong> {pet.owner}</Card.Text>
                                <Button variant="info" onClick={() => handleFoundClick(pet._id)}>Report Found</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : <p className="text-center w-100">No pets to display.</p>}
            </Row>

            {/* Report Lost Pet Button */}
            <div className="text-center mt-4 mb-4">
                <Button variant="warning" onClick={() => setShowLostModal(true)}>Report Lost Pet</Button>
                <div className="mt-3"><Link to={'/profile'} style={{ color: 'black', textDecoration: 'none' }} className='bg-info rounded p-2'>Check Your Lost Pet Status</Link></div>

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
                    <Button variant="warning" onClick={handleFoundSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>

            {/* Lost Pet Modal */}
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
                                onChange={(e) => setNewLostPet({ ...newLostPet, location: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="petImage" className="mt-2">
                            <Form.Label>Upload Image of the Pet</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setNewLostPet({ ...newLostPet, lostPetImage: file });
                                    setImagePreview(file ? URL.createObjectURL(file) : null);
                                }}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLostModal(false)}>Cancel</Button>
                    <Button variant="warning" onClick={handleReportLostPet}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default LostPets;
