import React, { useEffect, useState } from "react";
import { Table, Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import "../App.css";
import { deleteUserApi, editUserApi, getAllAdoptRequestApi, getAllPetDetailsApi, getAllUserDetailsApi, getLostPetApi, getUserDetailsApi, registerApi } from "../services/allApi";

function AdminPanel() {
    const [selectedSection, setSelectedSection] = useState("users");

    // Sample Data
    const [users, setUsers] = useState([]);

    const [pets, setPets] = useState([]);

    const [lostAndFoundPets, setLostAndFoundPets] = useState([]);

    const [adoptions, setAdoptions] = useState([]);

    // Modals
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editPet, setEditPet] = useState(null);
    const getUsers = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getAllUserDetailsApi(reqHeader)
            console.log("Users:")
            console.log(result.data)
            const filteredUsers = result.data.filter(
                user => user.username !== 'admin' && user.username !== 'shelter'
            )
            setUsers(filteredUsers)
        } catch (error) {
            console.log("Something Happened", error)
        }
    }
    const getPets = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getAllPetDetailsApi(reqHeader)
            console.log("Pets:")
            console.log(result.data)
            setPets(result.data)
        } catch (error) {
            console.log("Something Happened", error)
        }
    }
    const getLostPets = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getLostPetApi(reqHeader)
            console.log("Lost pets:")
            console.log(result)
            setLostAndFoundPets(result.data)
        } catch (error) {
            console.log("Something Happened", error)
        }
    }
    const getAdoptionRequests = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getAllAdoptRequestApi(reqHeader)
            console.log("Adoption Requests:")
            console.log(result.data)
            setAdoptions(result.data)
        } catch (error) {
            console.log("Something Happened", error)
        }
    }
    useEffect(() => {
        getUsers()
        getPets()
        getLostPets()
        getAdoptionRequests()
    }, [])
    // User handlers
    const handleAddUser = () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = registerApi(editUser, reqHeader)
            setEditPet(null);
            setShowModal(true);
        } catch (error) {
            console.log(error)
        }
    };

    const handleEditUser = (id, user) => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = editUserApi(id, user, reqHeader)
            setEditPet(null);
            setShowModal(true);
        } catch (error) {
            console.log(error)
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const token = sessionStorage.getItem("token")
                const reqHeader = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                const result = await deleteUserApi(id, reqHeader)
                getUsers()
            } catch (error) {
                console.log(error)
            }
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
                            {
                                users.length > 0 ?
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Phone Number</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {

                                                users.map((user) => (
                                                    <tr >
                                                        <td>{user.username}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone}</td>
                                                        <td>
                                                            <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>{' '}
                                                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table> : <p>NO USER DETAILS FOUND!</p>
                            }
                        </>
                    )}

                    {selectedSection === "pets" && (
                        <>
                            <h4>Manage Pets</h4>
                            <Button variant="primary" onClick={handleAddPet} className="mb-3">Add Pet</Button>
                            {
                                pets.length > 0 ?
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Age</th>
                                                <th>Health</th>
                                                <th>Next Vet Appointment</th>
                                                <th>Vaccinations</th>
                                                <th>Owner</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (
                                                    pets.map((pet) => (
                                                        <tr key={pet._id}>
                                                            <td>{pet.name}</td>
                                                            <td>{pet.type}</td>
                                                            <td>{pet.age}</td>
                                                            <td>{pet.health}</td>
                                                            <td>{pet.nextVetAppointment?.slice(0, 10)}</td>
                                                            <td>{pet.vaccinations}</td>
                                                            <td>{pet.userId?.username || 'Unknown'}</td>
                                                            <td>
                                                                <Button variant="warning" size="sm" onClick={() => handleEditPet(pet)}>Edit</Button>{' '}
                                                                <Button variant="danger" size="sm" onClick={() => handleDeletePet(pet._id)}>Delete</Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                    : (

                                        <p>NO PET DETAILS FOUND!</p>

                                    )
                            }
                        </>
                    )}

                    {selectedSection === "lostAndFoundPets" && (
                        <>
                            <h4>Lost & Found Pets Approval</h4>
                            {
                                lostAndFoundPets?.length > 0 ?
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Owner</th>
                                                <th>Last Found Location</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {

                                                lostAndFoundPets.map((pet) => (
                                                    <tr>
                                                        <td>{pet.name}</td>
                                                        <td>{pet.type}</td>
                                                        <td>{pet.status}</td>
                                                        <td>{pet.owner}</td>
                                                        <td>{pet.location}</td>
                                                        <td>
                                                            {pet.status === "Not Found" && (
                                                                <>
                                                                    <Button variant="success" size="sm" onClick={() => handleApprovePet(pet.id)}>Approve</Button>{' '}
                                                                    <Button variant="danger" size="sm" onClick={() => handleRejectPet(pet.id)}>Reject</Button>{' '}
                                                                </>
                                                            )}
                                                            {pet.status === "Found" && (
                                                                <Button variant="danger" size="sm" onClick={() => handleDeleteLostFoundPet(pet.id)}>Delete</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    : <p>NO LOST PETS LISTING</p>
                            }
                        </>
                    )}

                    {selectedSection === "adoptions" && (
                        <>
                            <h4>Approve Adoptions</h4>
                            {
                                adoptions.length > 0 ?
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>

                                                <th>Pet Name</th>
                                                <th>Type</th>
                                                <th>User</th>
                                                <th>Contact</th>
                                                <th>Donation (₹)</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adoptions.map((adoption) => (
                                                <tr>

                                                    <td>{adoption.pet.name}</td>
                                                    <td>{adoption.pet.type}</td>
                                                    <td>{adoption.name}</td>
                                                    <td>{adoption.contact}</td>
                                                    <td>{adoption.donation}</td>
                                                    <td>{adoption.status}</td>
                                                    <td>
                                                        {adoption.status === "Request submitted" && (
                                                            <>
                                                                <Button variant="success" size="sm" className="me-1" >Approve</Button>
                                                                <Button variant="danger" size="sm" >Reject</Button>
                                                            </>
                                                        )}
                                                        {adoption.status === "Approved" && (
                                                            <Button variant="danger" size="sm" >Delete</Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table> : <p>NO ADOPTION REQUESTS FOUND!</p>
                            }
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editUser.phone}
                                        onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
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
