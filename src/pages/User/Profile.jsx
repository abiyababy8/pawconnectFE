import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col, Card, Form, Modal } from "react-bootstrap";
import "../../App.css";
import { getUserDetailsApi } from "../../services/allApi";

function Profile() {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [showFoundPetModal, setShowFoundPetModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showLostPetModal, setShowLostPetModal] = useState(false);
  const [showAdoptPetModal, setShowAdoptPetModal] = useState(false);
  const [selectedLostPet, setSelectedLostPet] = useState(null);
  const [selectedPetForAdoption, setSelectedPetForAdoption] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [userDetails, setUserDetails] = useState([])
  const getUserDetails = async () => {
    const token = sessionStorage.getItem("token")
    const requestHeader = {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${token}`
    }
    const result = await getUserDetailsApi(requestHeader)
    console.log("User Details:", result.data)
    setUserDetails(result.data)
  }
  useEffect(() => {
    getUserDetails()
  }, [])

  // Sample User Data
  const user = { username: "john_doe", email: "john@example.com", phone: "123-456-7890" };

  // Sample Data

  const petsGivenForAdoption = [
    { id: 10, name: "Tommy", status: "Pending" },
    { id: 11, name: "Snowy", status: "Adopted" }
  ];

  const adoptionRequests = [
    { id: 12, petName: "Luna", status: "Pending" },
    { id: 13, petName: "Charlie", status: "Approved" }
  ];

  const myLostPets = [
    { id: 14, name: "Rocky", foundStatus: "Not Found" },
    { id: 15, name: "Milo", foundStatus: "Found" }
  ];

  // Functions
  const handleReportFoundPet = (pet) => {
    setSelectedLostPet(pet);
    setShowFoundPetModal(true);
  };

  const handleAdoptPet = (pet) => {
    setSelectedPetForAdoption(pet);
    setShowAdoptPetModal(true);
  };

  return (
    <Container fluid className="user-dashboard">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="sidebar">
          <h3 className="text-center">User Dashboard</h3>
          <ul className="sidebar-menu">
            <li className={selectedSection === "profile" ? "active" : ""} onClick={() => setSelectedSection("profile")}>View Profile</li>
            <li className={selectedSection === "adoptionStatus" ? "active" : ""} onClick={() => setSelectedSection("adoptionStatus")}>Pet Adoption Status</li>
            <li className={selectedSection === "lostPetsStatus" ? "active" : ""} onClick={() => setSelectedSection("lostPetsStatus")}>My Lost Pets Status</li>
          </ul>
        </Col>

        {/* Main Content */}
        <Col md={9} className="dashboard-content">
          {selectedSection === "profile" && (
            <Card className="p-4">
              <h4>Profile Information</h4>
              {
                userDetails?
                    <>
                      <p><strong>Username:</strong> {userDetails.username}</p>
                      <p><strong>Email:</strong> {userDetails.email}</p>
                      <p><strong>Phone:</strong> {userDetails.phone}</p>
                    </>
                  :
                  <p>NO USER DETAILS FOUND!</p>
              }
              <Button variant="primary" onClick={handleShow}>Edit Profile</Button>
            </Card>
          )}


          {/* Pet Adoption Status Section */}
          {selectedSection === "adoptionStatus" && (
            <>
              <h4>Pet Adoption Status</h4>

              <h5 className="mt-4">Pets You Have Given for Adoption</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {petsGivenForAdoption.map((pet) => (
                    <tr key={pet.id}>
                      <td>{pet.name}</td>
                      <td>{pet.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="mt-5">Pets You Are Adopting</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Request Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptionRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.petName}</td>
                      <td>{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* My Lost Pets Status Section */}
          {selectedSection === "lostPetsStatus" && (
            <>
              <h4>My Lost Pets Status</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Found Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myLostPets.map((pet) => (
                    <tr key={pet.id}>
                      <td>{pet.name}</td>
                      <td>{pet.foundStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>EDIT YOUR PROFILE INFORMATION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="number" placeholder="Phone number" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
}

export default Profile;
