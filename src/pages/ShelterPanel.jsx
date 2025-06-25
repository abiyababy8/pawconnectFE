import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import "../App.css";
import { addAdoptPetDetailsApi, deleteAdoptListApi, deleteAdoptRequestApi, getAllAdoptRequestApi, getUserAdoptListApi, updateAdoptListApi, updateAdoptRequestStatusApi } from "../services/allApi";
import { base_url } from "../services/base_url";

function ShelterPanel() {
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const handleCloseAddPetModal = () => setShowAddPetModal(false);
  const handleShowAddPetModal = () => setShowAddPetModal(true);
  const [showEditPetModal, setShowEditPetModal] = useState(false);
  const handleCloseEditPetModal = () => setShowEditPetModal(false);
  const handleShowEditPetModal = () => setShowEditPetModal(true);
  const user = JSON.parse(sessionStorage.getItem("user"))
  const [newPet, setNewPet] = useState({ name: '', type: '', description: '', owner: user?.name, lastLocation: '', image: null, status: 'Pending' });
  const [imagePreview, setImagePreview] = useState(null);

  const [editPet, setEditPet] = useState({ id: null, name: "", type: "", description: "", owner: user?.name, lastLocation: '', image: null, status: 'Pending' });
  const [selectedSection, setSelectedSection] = useState("pets");

  const [pets, setPets] = useState([]);

  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [editPetImagePreview, setEditPetImagePreview] = useState(null);

  useEffect(() => {
    // If user uploads a new image file
    if (editPet.image instanceof File) {
      const previewURL = URL.createObjectURL(editPet.image);
      setEditPetImagePreview(previewURL);

      // Cleanup to avoid memory leaks
      return () => URL.revokeObjectURL(previewURL);
    } else if (typeof editPet.image === 'string') {
      // If it's an existing image URL (from DB)
      setEditPetImagePreview(`${base_url}/uploads/${editPet.image}`);
    } else {
      // No image selected
      setEditPetImagePreview(null);
    }
  }, [editPet.image]);


  const handleAddPet = async () => {
    const { name, type, description, owner, lastLocation, image, status } = newPet;
    // if (!name || !type || !description || !owner || !lastLocation || !image) {
    //   toast.warning("Please fill the form completely!");
    //   return;
    // }

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
      setNewPet({ name: '', type: '', description: '', owner: user?.name, lastLocation: '', image: null, status: 'pending' });
      handleCloseAddPetModal()
      setImagePreview(null);
      getShelterPets();
      //toast.success(`${name} added successfully!`);
    } catch (err) {
      //toast.error("Something went wrong while adding the pet.");
      console.log("Error:", err);
    }
  };

  const handleDeletePet = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };
      const result = await deleteAdoptListApi(id, reqHeader)
      getShelterPets()
    } catch (error) {
      console.log(error)
    }

  };

  const handleUpdatePet = async (id, data) => {
    try {
      const { name, type, description, owner, lastLocation, image, status } = editPet;
      // if (!name || !type || !description || !owner || !lastLocation || !image) {
      //   toast.warning("Please fill the form completely!");
      //   return;
      // }

      const reqBody = new FormData();
      reqBody.append("name", name);
      reqBody.append("type", type);
      reqBody.append("description", description);
      reqBody.append("owner", owner);
      reqBody.append("lastLocation", lastLocation);
      reqBody.append("status", status);
      if (editPet.image instanceof File) {
        reqBody.append("image", image);
      }
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };
      const result = await updateAdoptListApi(id, reqBody, reqHeader)
      getShelterPets()
      handleCloseEditPetModal()
    } catch (error) {
      console.log(error)
    }
  };

  const handleApproveAdoption = async (id, status) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      const result = await updateAdoptRequestStatusApi(id, status, reqHeader)
      getAdoptRequests()
    } catch (error) {
      console.log(error)
    }
  };

  const handleRejectAdoption = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      const result = await deleteAdoptRequestApi(id, reqHeader)
      getAdoptRequests()
    } catch (error) {
      console.log(error)
    }
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
      const shelterPets = result.data.filter(item => item.pet.owner === user.name)
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
              {
                pets?.length > 0 ?
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Image</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pets.map(pet => (
                        <tr >
                          <td>{pet.name}</td>
                          <td>{pet.type}</td>
                          <td><img src={`${base_url}/uploads/${pet.image}`} alt="" height={'100px'} width={'100px'} /></td>
                          <td>{pet.description}</td>
                          <td>{pet.lastLocation}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => {
                                setEditPet({
                                  id: pet._id,
                                  name: pet.name,
                                  type: pet.type,
                                  description: pet.description,
                                  owner: pet.owner,
                                  lastLocation: pet.lastLocation,
                                  image: pet.image,
                                  status: pet.status
                                });
                                handleShowEditPetModal();
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeletePet(pet._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table> :
                  <p className="text-secondary">NO PETS FOUND!</p>
              }

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

                    <Form.Group controlId="formDescription" className="mt-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control as="textarea" rows={2} placeholder="Location" value={newPet.lastLocation} onChange={(e) => setNewPet({ ...newPet, lastLocation: e.target.value })} />
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
                    <Form.Group controlId="formPetName">
                      <Form.Label>Pet Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter pet name" value={editPet.name} onChange={(e) => setEditPet({ ...editPet, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formPetType" className="mt-3">
                      <Form.Label>Pet Type</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter pet type (e.g., Dog or Cat)"
                        value={editPet.type}
                        onChange={(e) => setEditPet({ ...editPet, type: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mt-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={2} placeholder="Short description" value={editPet.description} onChange={(e) => setEditPet({ ...editPet, description: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formOwner" className="mt-3">
                      <Form.Label>Owner Name</Form.Label>
                      <Form.Control type="text" placeholder="Owner's name" value={editPet.owner} onChange={(e) => setEditPet({ ...editPet, owner: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formLocation" className="mt-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control type="text" placeholder="Current Location of the pet" value={editPet.lastLocation} onChange={(e) => setEditPet({ ...editPet, lastLocation: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formImage" className="mt-3">
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setEditPet({ ...editPet, image: file });
                          setEditPetImagePreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      {editPetImagePreview && (
                        <div className="mt-2">
                          <img
                            src={editPetImagePreview}
                            alt="Pet Preview"
                            style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => handleUpdatePet(editPet.id, editPet)}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}

          {selectedSection === "adoptions" && (
            <>
              <h4>Adoption Requests</h4>
              {
                adoptionRequests?.length > 0 ?
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
                                <Button variant="success" size="sm" onClick={() => { const updatedStatus = "Approved"; handleApproveAdoption(req._id, updatedStatus) }}>Approve</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleRejectAdoption(req._id)}>Reject</Button>
                              </>
                            )}
                            {
                              req.status === "Approved" && (
                                <>
                                  <Button variant="danger" size="sm" onClick={() => handleRejectAdoption(req._id)}>Delete</Button>
                                </>
                              )
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table> :
                  <p className="text-secondary">NO ADOPTION REQUESTS FOUND!</p>
              }
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ShelterPanel;
