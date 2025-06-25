import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col, Card, Form, Modal } from "react-bootstrap";
import "../../App.css";
import { editUserApi, getUserAdoptListApi, getUserAdoptRequestApi, getUserDetailsApi, getUserLostPetApi, updateLostPetStatusApi, deleteAdoptListApi, deleteAdoptRequestApi, deleteLostPetApi, updateAdoptListStatusApi, updateAdoptRequestStatusApi } from "../../services/allApi";
import { Link } from "react-router-dom";
import LostPets from "../LostPets";

function Profile() {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [showFoundPetModal, setShowFoundPetModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showLostPetModal, setShowLostPetModal] = useState(false);
  const [showAdoptPetModal, setShowAdoptPetModal] = useState(false);
  const [selectedLostPet, setSelectedLostPet] = useState(null);
  const [selectedPetForAdoption, setSelectedPetForAdoption] = useState(null);
  const [userDetails, setUserDetails] = useState({
    _id: '',
    username: '',
    email: '',
    phone: '',
  })
  const [petsGivenForAdoption, setPetsGivenForAdoption] = useState([])
  const [adoptionRequests, setAdoptionRequests] = useState([])
  const [myLostPets, setMyLostPets] = useState([])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getUserDetails = async () => {
    const token = sessionStorage.getItem("token")
    const requestHeader = {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${token}`
    }
    const result = await getUserDetailsApi(requestHeader)
    console.log("My Details:", result.data)
    setUserDetails(result.data)
  }
  useEffect(() => {
    getUserDetails()
  }, [])
  const handleReportFoundPet = (pet) => {
    setSelectedLostPet(pet);
    setShowFoundPetModal(true);
  };

  const handleAdoptPet = (pet) => {
    setSelectedPetForAdoption(pet);
    setShowAdoptPetModal(true);
  };
  const handleEditUserDetails = async () => {
    try {
      const { _id } = userDetails
      const token = sessionStorage.getItem("token");


      const requestHeader = {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${token}`
      }

      const result = await editUserApi(_id, userDetails, requestHeader)
      console.log(result)
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }
  const getMyAdoptionListings = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const result = await getUserAdoptListApi(reqHeader)
      console.log('My Pets Given For Adoption:')
      console.log(result.data)
      setPetsGivenForAdoption(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getMyAdoptionRequests = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const result = await getUserAdoptRequestApi(reqHeader)
      console.log('My Requests For Adoption:')
      console.log(result.data)
      setAdoptionRequests(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getMyLostPets = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const result = await getUserLostPetApi(reqHeader)
      console.log('My lost pets:')
      console.log(result.data)
      setMyLostPets(result.data)
    } catch (error) {
      console.log('There is an error in fetching your lost pets:')
      console.log(error)
    }
  }
  useEffect(() => {
    getUserDetails()
    getMyAdoptionListings()
    getMyAdoptionRequests()
    getMyLostPets()
  }, [])
  const handleDeleteAdoptionListing = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const result = await deleteAdoptListApi(id, reqHeader);
      console.log("Deleted Adoption Listing", result);
      // Remove from UI
      setPetsGivenForAdoption(petsGivenForAdoption.filter(pet => pet._id !== id));
      getMyAdoptionListings()
    } catch (error) {
      console.error("Failed to delete adoption listing:", error);
    }
  };

  const handleDeleteAdoptionRequest = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const result = await deleteAdoptRequestApi(id, reqHeader);
      console.log("Deleted Adoption Request", result);
      // Remove from UI
      setAdoptionRequests(adoptionRequests.filter(request => request._id !== id));
      getMyAdoptionRequests()
    } catch (error) {
      console.error("Failed to delete adoption request:", error);
    }
  };

  const handleDeleteLostPetListing = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const result = await deleteLostPetApi(id, reqHeader);
      console.log("Deleted Lost Pet Listing", result);
      // Remove from UI
      setMyLostPets(myLostPets.filter(pet => pet._id !== id));
      getMyLostPets()
    } catch (error) {
      console.error("Failed to delete lost pet listing:", error);
    }
  };

  const updateAdoptionListing = async (petId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const result = await updateAdoptListStatusApi(petId, status, headers);
      console.log("Updated Adoption Listing", result);
      // Update UI
      setPetsGivenForAdoption(prev =>
        prev.map(pet => pet._id === petId ? { ...pet, status } : pet)
      );
    } catch (error) {
      console.error("Failed to update adoption listing status:", error);
    }
  };

  const updateAdoptionRequest = async (requestId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const result = await updateAdoptRequestStatusApi(requestId, status, headers);
      console.log("Updated Adoption Request", result);
      // Update UI
      setAdoptionRequests(prev =>
        prev.map(req => req._id === requestId ? { ...req, status } : req)
      );
    } catch (error) {
      console.error("Failed to update adoption request status:", error);
    }
  };

  const updateLostPetStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("token")
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const result = await updateLostPetStatusApi(id, status, reqHeader)
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
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
                userDetails ?
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
              {
                petsGivenForAdoption?.length > 0 ?
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Pet Name</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {petsGivenForAdoption.map((pet) => (
                        <tr>
                          <td>{pet.name}</td>
                          <td>{pet.status}</td>
                          <td>
                            {
                              pet.status == 'Pending' &&
                              <>
                                <button className="btn btn-danger ms-2" onClick={() => handleDeleteAdoptionListing(pet._id)}> Delete</button>
                              </>
                            }
                            {pet.status === 'Approved' &&
                              <>
                                <button className="btn btn-danger ms-2" onClick={() => handleDeleteAdoptionListing(pet._id)}> Mark as Adopted</button>
                              </>
                            }

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table> :
                  <p className="text-secondary">NO ADOPTION LISTINGS BY YOU!</p>
              }
              <Link to={'/adopt-pets'}><button className="btn btn-primary">Add A Pet For Adoption</button></Link>
              <h5 className="mt-5">Pets You Are Adopting</h5>
              {
                adoptionRequests?.length > 0 ?
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Pet Name</th>
                        <th>Request Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {adoptionRequests.map((request) => (
                        <tr>
                          <td>{request.pet.name}</td>
                          <td>{request.status}</td>
                          <td>
                            {
                              request.status == 'Request submitted' &&
                              <>
                                <button className="btn btn-danger ms-2" onClick={() => handleDeleteAdoptionRequest(request._id)}> Delete</button>
                              </>
                            }
                            {
                              request.status == 'Approved' &&

                              <button className="btn btn-danger ms-2" onClick={() => {handleDeleteAdoptionListing(request.pet._id);handleDeleteAdoptionRequest(request._id)}}>Mark as Adopted</button>


                            } </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table> :
                  <p className="text-secondary">NO ADOPTION REQUESTS BY YOU!</p>
              }
              <Link to={'/adopt-pets'}><button className="btn btn-primary">Adopt A Pet</button></Link>
            </>
          )}

          {/* My Lost Pets Status Section */}
          {selectedSection === "lostPetsStatus" && (
            <>
              <h4>My Lost Pets Status</h4>
              {
                myLostPets?.length > 0 ?
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Pet Name</th>
                        <th>Found Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLostPets?.map((pet) => (
                        <tr key={pet._id}>
                          <td>{pet.name}</td>
                          <td>{pet.status}</td>
                          <td>
                            {
                              pet.status == 'Not Found' ?
                                <>
                                  <button className="btn btn-outline-primary" onClick={() => {
                                    const updatedStatus = "Found";
                                    updateLostPetStatus(pet._id, updatedStatus);
                                    setMyLostPets(item =>
                                      item.map(item => item._id === pet._id ? { ...item, status: updatedStatus } : item)
                                    );
                                  }}><i className="fa-solid fa-pencil"></i> Mark as Found</button>
                                  <button className="btn btn-outline-danger ms-2" onClick={() => handleDeleteLostPetListing(pet._id)}><i className="fa-solid fa-trash"></i> Delete Listing</button>
                                </> :
                                <>
                                  <button className="btn btn-outline-primary" onClick={() => {
                                    const updatedStatus = "Not Found";
                                    updateLostPetStatus(pet._id, updatedStatus);
                                    setMyLostPets(item =>
                                      item.map(item => item._id === pet._id ? { ...item, status: updatedStatus } : item)
                                    );
                                  }}><i className="fa-solid fa-pencil"></i> Mark as Not Found</button>
                                  <button className="btn btn-outline-danger ms-2" onClick={() => handleDeleteLostPetListing(pet._id)}><i className="fa-solid fa-trash"></i> Delete Listing</button>
                                </>
                            }

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table> :
                  <p className="text-secondary">NO LOST PETS!</p>
              }
              <Link to={'/lost-pets'}><button className="btn btn-primary">Add A Lost Pet</button></Link>

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
              <Form.Control type="text" placeholder="Username" value={userDetails.username} onChange={(e) => { setUserDetails({ ...userDetails, username: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={userDetails.email} onChange={(e) => { setUserDetails({ ...userDetails, email: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="number" placeholder="Phone number" value={userDetails.phone} onChange={(e) => { setUserDetails({ ...userDetails, phone: e.target.value }) }} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleEditUserDetails}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
}

export default Profile;
