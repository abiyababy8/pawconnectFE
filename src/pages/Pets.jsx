import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { addAdoptPetDetailsApi, addAdoptRequestApi, getAdoptPetApi } from '../services/allApi';
import { base_url } from '../services/base_url';

function Pets() {
  const [petData, setPetData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [newPet, setNewPet] = useState({ name: '', type: '', description: '', owner: '', lastLocation: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [requestDetails, setRequestDetails] = useState({
    name: "",
    contact: "",
    donation: "",
    pet: ""
  })
  const navigate = useNavigate();

  // Filter Pets
  const filteredPets = selectedFilter === 'All'
    ? (petData || [])
    : (petData || []).filter(pet => pet.type === selectedFilter);

  // Handle adopt button click
  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setShowAdoptModal(true);
  };

  // Handle Add New Pet
  const handleAddNewPet = async () => {
    const { name, type, description, owner, lastLocation, image } = newPet;
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

    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    };

    try {
      const result = await addAdoptPetDetailsApi(reqBody, reqHeader);
      console.log("Pets to be adopted:", result);
      setNewPet({ name: '', type: '', description: '', owner: '', lastLocation: '', image: null });
      setImagePreview(null);
      setShowAddPetModal(false);
      getAdoptPetListing();
      toast.success(`${name} added successfully!`);
    } catch (err) {
      toast.error("Something went wrong while adding the pet.");
      console.log("Error:", err);
    }
  };

  const getAdoptPetListing = async () => {
    const token = sessionStorage.getItem("token");
    const requestHeader = {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${token}`
    };

    try {
      const result = await getAdoptPetApi(requestHeader);
      if (result.status === 200) {
        setPetData(result.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        navigate('/login'); // Redirect to login page
      } else {
        toast.error("Failed to fetch pets.");
      }
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      getAdoptPetListing();
    } else {
      toast.error("Unauthorized access. Please log in.");
      navigate('/login'); // redirect to login if token missing
    }
  }, []);

  const handleAddAdoptionRequest = async () => {
    const { name, contact, donation, pet } = requestDetails

    if (!name || !contact || !donation) {
      toast.warning("Please fill the form completely!")
    }
    else {
      const reqBody = {
        name,
        contact,
        donation,
        pet: pet
      };
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      try {
        const result = await addAdoptRequestApi(reqBody, reqHeader)
        if (result.status === 201) {
          console.log(result.data)
          toast.success(result.data)
          setRequestDetails({
            name: "",
            contact: "",
            donation: "",
            pet: ""
          })
          setShowAdoptModal(false)
        }
        else if (result.status === 406) {
          toast.warning("You have already Submitted request for this pet")
          setRequestDetails({
            name: "",
            contact: "",
            donation: "",
            pet: ""
          })
          setShowAdoptModal(false)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
  }
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
      <Row className='justify-content-center'>
        {filteredPets.length > 0 ? filteredPets.map((pet) => (
          <Col key={pet._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Img variant="top" src={`${base_url}/uploads/${pet.image}`} className="pet-card-image" />
              <Card.Body className="text-center">
                <Card.Title>{pet.name}</Card.Title>
                <Card.Text>{pet.description?.slice(0, 28)}...</Card.Text>
                <Card.Text><strong>Owner:</strong> {pet.owner}</Card.Text>
                <Card.Text><strong>Location:</strong> {pet.lastLocation}</Card.Text>
                <Button variant="info" onClick={() => handleAdoptClick(pet)}>Adopt</Button>
              </Card.Body>
            </Card>
          </Col>
        )) : <p className="text-center w-100">No pets to display.</p>}
      </Row>

      {/* Add New Pet Button */}
      <div className="text-center mt-4 mb-4">
        <Button variant="warning" onClick={() => setShowAddPetModal(true)}>
          Add New Pet for Adoption
        </Button>
        <br />
        <div className="mt-3">
          <Link to={'/profile'} style={{ color: 'black', textDecoration: 'none' }} className='bg-info rounded p-2'>
            Check Your Pet Adoption Status
          </Link>
        </div>
      </div>

      {/* Adopt Modal */}
      <Modal show={showAdoptModal} onHide={() => setShowAdoptModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adopt {selectedPet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPetName">
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedPet?.name}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" onChange={(e) => setRequestDetails({ ...requestDetails, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formContact" className="mt-3">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control type="text" placeholder="Enter your contact details" onChange={(e) => setRequestDetails({ ...requestDetails, contact: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formDonation" className="mt-4">
              <Form.Label>Support Our Rescue Efforts</Form.Label>
              <Form.Control type="number" placeholder="Enter donation amount (₹)" min="100" onChange={(e) => setRequestDetails({ ...requestDetails, donation: e.target.value })} />
              <Form.Text className="text-muted">
                Your support helps cover food, vaccinations, and rescue operations. ❤️
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleAddAdoptionRequest}>
            Submit Adoption Request
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Pet Modal */}
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
          <Button variant="warning" onClick={handleAddNewPet}>
            Add Pet
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}

export default Pets;
