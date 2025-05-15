import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import "../App.css";

function ShelterPanel() {
    const [showAddPetModal, setShowAddPetModal] = useState(false);
    const [showEditPetModal, setShowEditPetModal] = useState(false);
    const [newPet, setNewPet] = useState({ name: "", type: "", description: "" });
    const [editPet, setEditPet] = useState({ id: null, name: "", type: "", description: "" });
    const [selectedSection, setSelectedSection] = useState("pets");

    const [pets, setPets] = useState([
        { id: 1, name: "Buddy", type: "Dog", description: "Friendly Golden Retriever" },
        { id: 2, name: "Whiskers", type: "Cat", description: "Curious tabby cat" }
    ]);

    const [adoptionRequests, setAdoptionRequests] = useState([
        { id: 1, user: "Alan", petName: "Buddy", type: "Dog", status: "Pending" }
    ]);

    const handleAddPet = () => {
        const newId = pets.length > 0 ? pets[pets.length - 1].id + 1 : 1;
        const petToAdd = {
            id: newId,
            name: newPet.name,
            type: newPet.type,
            description: newPet.description,
        };
        setPets(prev => [...prev, petToAdd]);
        setNewPet({ name: "", type: "", description: "" });
        setShowAddPetModal(false);
    };

    const handleDeletePet = (id) => {
        setPets(prev => prev.filter(pet => pet.id !== id));
    };

    const handleEditPet = (pet) => {
        setEditPet(pet);
        setShowEditPetModal(true);
    };

    const handleUpdatePet = () => {
        setPets(prev => prev.map(pet => pet.id === editPet.id ? editPet : pet));
        setShowEditPetModal(false);
    };

    const handleApproveAdoption = (id) => {
        setAdoptionRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Approved" } : req));
    };

    const handleRejectAdoption = (id) => {
        setAdoptionRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <Container fluid className="admin-panel">
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar">
                    <h3 className="text-center">Shelter Dashboard</h3>
                    <ul className="sidebar-menu">
                        {["pets", "adoptions"].map(section => (
                            <li
                                key={section}
                                className={selectedSection === section ? "active" : ""}
                                onClick={() => setSelectedSection(section)}
                            >
                                {section === "pets" && "Manage Pets"}
                                {section === "adoptions" && "Approve Adoptions"}
                            </li>
                        ))}
                    </ul>
                </Col>

                {/* Main Content */}
                <Col md={9} className="admin-content">
                    {selectedSection === "pets" && (
                        <>
                            <h4>Manage Pets</h4>
                            <Button variant="primary" className="mb-3" onClick={() => setShowAddPetModal(true)}>
                                Add Pet
                            </Button>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pets.map(pet => (
                                        <tr key={pet.id}>
                                            <td>{pet.id}</td>
                                            <td>{pet.name}</td>
                                            <td>{pet.type}</td>
                                            <td>{pet.description}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEditPet(pet)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeletePet(pet.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Modal for Adding Pet */}
                            <Modal show={showAddPetModal} onHide={() => setShowAddPetModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add New Pet</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Pet Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newPet.name}
                                                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-3">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newPet.type}
                                                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-3">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={newPet.description}
                                                onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowAddPetModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleAddPet}>
                                        Add Pet
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* Modal for Editing Pet */}
                            <Modal show={showEditPetModal} onHide={() => setShowEditPetModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Pet</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Pet Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editPet.name}
                                                onChange={(e) => setEditPet({ ...editPet, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-3">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editPet.type}
                                                onChange={(e) => setEditPet({ ...editPet, type: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-3">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={editPet.description}
                                                onChange={(e) => setEditPet({ ...editPet, description: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowEditPetModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleUpdatePet}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    )}

                    {selectedSection === "adoptions" && (
                        <>
                            <h4>Adoption Requests</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Pet Name</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adoptionRequests.map(req => (
                                        <tr key={req.id}>
                                            <td>{req.id}</td>
                                            <td>{req.user}</td>
                                            <td>{req.petName}</td>
                                            <td>{req.type}</td>
                                            <td>{req.status}</td>
                                            <td>
                                                {req.status === "Pending" && (
                                                    <>
                                                        <Button variant="success" size="sm" onClick={() => handleApproveAdoption(req.id)}>Approve</Button>{' '}
                                                        <Button variant="danger" size="sm" onClick={() => handleRejectAdoption(req.id)}>Reject</Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ShelterPanel;
