import React, { useState } from "react";
import { Table, Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import "../App.css";

function AdminPanel() {
    const [selectedSection, setSelectedSection] = useState("users");

    // Sample Data
    const [users, setUsers] = useState([
        { id: 1, username: "john_doe", email: "john@example.com" },
        { id: 2, username: "jane_doe", email: "jane@example.com" }
    ]);

    const [pets, setPets] = useState([
        { id: 1, name: "Buddy", type: "Dog", description: "Friendly Golden Retriever", approved: false },
        { id: 2, name: "Whiskers", type: "Cat", description: "Curious tabby cat", approved: false }
    ]);

    const [lostAndFoundPets, setLostAndFoundPets] = useState([
        { id: 1, name: "Max", type: "Dog", status: "Pending", category: "lost" },
        { id: 2, name: "Luna", type: "Cat", status: "Pending", category: "found" }
    ]);

    const [adoptions, setAdoptions] = useState([
        { id: 1, user: "john_doe", petName: "Buddy", petType: "Dog", status: "Pending" },
        { id: 2, user: "jane_doe", petName: "Whiskers", petType: "Cat", status: "Pending" }
    ]);

    // Modals
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editPet, setEditPet] = useState(null);

    // User handlers
    const handleAddUser = () => {
        setEditUser({ id: users.length + 1, username: "", email: "" });
        setEditPet(null);
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setEditPet(null);
        setShowModal(true);
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleSaveUser = () => {
        const isExisting = users.some(u => u.id === editUser.id);
        if (isExisting) {
            setUsers(users.map(user => user.id === editUser.id ? editUser : user));
        } else {
            setUsers([...users, editUser]);
        }
        setShowModal(false);
    };

    // Pet handlers
    const handleAddPet = () => {
        setEditPet({ id: pets.length + 1, name: "", type: "", description: "", approved: false });
        setEditUser(null);
        setShowModal(true);
    };

    const handleEditPet = (pet) => {
        setEditPet(pet);
        setEditUser(null);
        setShowModal(true);
    };

    const handleDeletePet = (id) => {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            setPets(pets.filter(pet => pet.id !== id));
        }
    };

    const handleSavePet = () => {
        const isExisting = pets.some(p => p.id === editPet.id);
        if (isExisting) {
            setPets(pets.map(pet => pet.id === editPet.id ? editPet : pet));
        } else {
            setPets([...pets, editPet]);
        }
        setShowModal(false);
    };

    // Approval handlers for lost/found pets
    const handleApprovePet = (id) => {
        if (window.confirm("Are you sure you want to approve this pet?")) {
            setLostAndFoundPets(lostAndFoundPets.map(pet => pet.id === id ? { ...pet, status: "Approved" } : pet));
        }
    };

    const handleRejectPet = (id) => {
        if (window.confirm("Reject this pet report?")) {
            setLostAndFoundPets(lostAndFoundPets.filter(pet => pet.id !== id));
        }
    };

    const handleDeleteLostFoundPet = (id) => {
        if (window.confirm("Are you sure you want to delete this lost/found pet report?")) {
            setLostAndFoundPets(lostAndFoundPets.filter(pet => pet.id !== id));
        }
    };

    // Approval handlers for adoptions
    const handleApproveAdoption = (id) => {
        if (window.confirm("Are you sure you want to approve this adoption?")) {
            setAdoptions(adoptions.map(adoption => adoption.id === id ? { ...adoption, status: "Approved" } : adoption));
        }
    };

    const handleRejectAdoption = (id) => {
        if (window.confirm("Reject this adoption request?")) {
            setAdoptions(adoptions.filter(adoption => adoption.id !== id));
        }
    };

    const handleDeleteAdoption = (id) => {
        if (window.confirm("Are you sure you want to delete this adoption?")) {
            setAdoptions(adoptions.filter(adoption => adoption.id !== id));
        }
    };

    return (
        <Container fluid className="admin-panel">
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar">
                    <h3 className="text-center">Admin Panel</h3>
                    <ul className="sidebar-menu">
                        <li className={selectedSection === "users" ? "active" : ""} onClick={() => setSelectedSection("users")}>Manage Users</li>
                        <li className={selectedSection === "pets" ? "active" : ""} onClick={() => setSelectedSection("pets")}>Manage Pets</li>
                        <li className={selectedSection === "lostAndFoundPets" ? "active" : ""} onClick={() => setSelectedSection("lostAndFoundPets")}>Lost & Found Pets</li>
                        <li className={selectedSection === "adoptions" ? "active" : ""} onClick={() => setSelectedSection("adoptions")}>Approve Adoptions</li>
                    </ul>
                </Col>

                {/* Main Content */}
                <Col md={9} className="admin-content">
                    {selectedSection === "users" && (
                        <>
                            <h4>Manage Users</h4>
                            <Button variant="primary" onClick={handleAddUser} className="mb-3">Add User</Button>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    {selectedSection === "pets" && (
                        <>
                            <h4>Manage Pets</h4>
                            <Button variant="primary" onClick={handleAddPet} className="mb-3">Add Pet</Button>
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
                                    {pets.map((pet) => (
                                        <tr key={pet.id}>
                                            <td>{pet.id}</td>
                                            <td>{pet.name}</td>
                                            <td>{pet.type}</td>
                                            <td>{pet.description}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEditPet(pet)}>Edit</Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDeletePet(pet.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    {selectedSection === "lostAndFoundPets" && (
                        <>
                            <h4>Lost & Found Pets Approval</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lostAndFoundPets.map((pet) => (
                                        <tr key={pet.id}>
                                            <td>{pet.id}</td>
                                            <td>{pet.name}</td>
                                            <td>{pet.type}</td>
                                            <td>{pet.status}</td>
                                            <td>{pet.category}</td>
                                            <td>
                                                {pet.status === "Pending" && (
                                                    <>
                                                        <Button variant="success" size="sm" onClick={() => handleApprovePet(pet.id)}>Approve</Button>{' '}
                                                        <Button variant="danger" size="sm" onClick={() => handleRejectPet(pet.id)}>Reject</Button>{' '}
                                                    </>
                                                )}
                                                {pet.status === "Approved" && (
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteLostFoundPet(pet.id)}>Delete</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    {selectedSection === "adoptions" && (
                        <>
                            <h4>Approve Adoptions</h4>
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
                                    {adoptions.map((adoption) => (
                                        <tr key={adoption.id}>
                                            <td>{adoption.id}</td>
                                            <td>{adoption.user}</td>
                                            <td>{adoption.petName}</td>
                                            <td>{adoption.petType}</td>
                                            <td>{adoption.status}</td>
                                            <td>
                                                {adoption.status === "Pending" && (
                                                    <>
                                                        <Button variant="success" size="sm" onClick={() => handleApproveAdoption(adoption.id)}>Approve</Button>{' '}
                                                        <Button variant="danger" size="sm" onClick={() => handleRejectAdoption(adoption.id)}>Reject</Button>{' '}
                                                    </>
                                                )}
                                                {adoption.status === "Approved" && (
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteAdoption(adoption.id)}>Delete</Button>
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

            {/* Modal for Add/Edit */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editUser ? (editUser.username ? "Edit User" : "Add User") : editPet ? (editPet.name ? "Edit Pet" : "Add Pet") : ""}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {editUser && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editUser.username}
                                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    />
                                </Form.Group>
                            </>
                        )}
                        {editPet && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editPet.name}
                                        onChange={(e) => setEditPet({ ...editPet, name: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editPet.type}
                                        onChange={(e) => setEditPet({ ...editPet, type: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={editPet.description}
                                        onChange={(e) => setEditPet({ ...editPet, description: e.target.value })}
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveUser || handleSavePet}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminPanel;
