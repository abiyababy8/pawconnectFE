import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import "../App.css";
import { addAdoptPetDetailsApi, getAllAdoptRequestApi, getUserAdoptListApi } from "../services/allApi";

function ShelterPanel() {
    const [showAddPetModal, setShowAddPetModal] = useState(false);
    const handleCloseAddPetModal = () => setShowAddPetModal(false);
    const handleShowAddPetModal = () => setShowAddPetModal(true);
    const [showEditPetModal, setShowEditPetModal] = useState(false);
    const handleCloseEditPetModal = () => setShowEditPetModal(false);
    const handleShowEditPetModal = () => setShowEditPetModal(true);
    const user = JSON.parse(sessionStorage.getItem("user"))
      const [newPet, setNewPet] = useState({ name: '', type: '', description: '', owner: user.name, lastLocation: '', image: null, status: 'Pending' });
      const [imagePreview, setImagePreview] = useState(null);
    
    const [editPet, setEditPet] = useState({ id: null, name: "", type: "", description: "" });
    const [selectedSection, setSelectedSection] = useState("pets");

    const [pets, setPets] = useState([]);

    const [adoptionRequests, setAdoptionRequests] = useState([]);

    const handleAddPet = async () => {
        const { name, type, description, owner, lastLocation, image, status } = newPet;
        if (!name || !type || !description || !owner || !lastLocation || !image) {
          toast.warning("Please fill the form completely!");
          return;
        }
    
        const reqBody = new FormData();
        reqBody.append("name", name);
        reqBody.append("type", type);
        reqBody.append("description", description);
        reqBody.append("owner", owner);
        reqBody.append("lastLocation", lastLocation);
        reqBody.append("image", image);
        reqBody.append("status", status);
    
        const token = sessionStorage.getItem("token");
        const reqHeader = {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        };
    
        try {
          const result = await addAdoptPetDetailsApi(reqBody, reqHeader);
          console.log("Pets to be adopted:", result);
          setNewPet({ name: '', type: '', description: '', owner: user.name, lastLocation: '', image: null, status: 'pending' });
          handleCloseAddPetModal()
          setImagePreview(null);
          getShelterPets();
          //toast.success(`${name} added successfully!`);
        } catch (err) {
          //toast.error("Something went wrong while adding the pet.");
          console.log("Error:", err);
        }
      };

    const handleDeletePet = (id) => {

    };

    const handleUpdatePet = () => {

    };

    const handleApproveAdoption = (id) => {
    };

    const handleRejectAdoption = (id) => {
    };

    const getShelterPets = async () => {
        try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getUserAdoptListApi(reqHeader)
            console.log("Shelter Pets:")
            console.log(result.data)
            setPets(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getAdoptRequests = async () => {
        try {
          const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getAllAdoptRequestApi(reqHeader)
            console.log('all Adoption requests:')
            console.log(result.data)
            const shelterPets= result.data.filter(item=>item.pet.owner===user.name)
            setAdoptionRequests(shelterPets)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getShelterPets()
        getAdoptRequests()
    }, [])

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
                            <Button variant="primary" className="mb-3" onClick={handleShowAddPetModal}>
                                Add Pet
                            </Button>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pets.map(pet => (
                                        <tr >
                                            
                                            <td>{pet.name}</td>
                                            <td>{pet.type}</td>
                                            <td>{pet.description}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={handleShowEditPetModal}
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
                            <Modal show={showAddPetModal} onHide={handleCloseAddPetModal}>
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
                                             <Form.Control
                                               type="text"
                                               placeholder="Enter pet type (e.g., Dog or Cat)"
                                               value={newPet.type}
                                               onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                                             />
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
                                           <Form.Group controlId="formImage" className="mt-3">
                                             <Form.Label>Image</Form.Label>
                                             <Form.Control
                                               type="file"
                                               accept="image/*"
                                               onChange={(e) => {
                                                 const file = e.target.files[0];
                                                 setNewPet({ ...newPet, image: file });
                                                 setImagePreview(file ? URL.createObjectURL(file) : null);
                                               }}
                                             />
                                             {imagePreview && (
                                               <div className="mt-2">
                                                 <img
                                                   src={imagePreview}
                                                   alt="Pet Preview"
                                                   style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                                 />
                                               </div>
                                             )}
                                           </Form.Group>
                                         </Form>
                                       </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={handleAddPet}>
                                        Add Pet
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* Modal for Editing Pet */}
                            <Modal show={showEditPetModal} onHide={handleCloseEditPetModal}>
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
                                        
                                        <th>User</th>
                                        <th>Pet's Name</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adoptionRequests.map(req => (
                                        <tr>
                                            
                                            <td>{req.name}</td>
                                            <td>{req.pet.name}</td>
                                            <td>{req.pet.type}</td>
                                            <td>{req.status}</td>
                                            <td>
                                                {req.status === "Request submitted" && (
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
