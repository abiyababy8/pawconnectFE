import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userhome.css"; // Import CSS for popup animation
import { Modal, Button, Form } from 'react-bootstrap'
import { toast, ToastContainer } from "react-toastify";
import { addUserPetApi } from "../../services/allApi";

function UserHome() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const [showMissingPopup, setShowMissingPopup] = useState(false);
  const [showAdoptPopup, setShowAdoptPopup] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [petImage, setPetImage] = useState(null);
  const [petImagePreview, setPetImagePreview] = useState(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [token, setToken] = useState("")
  const [petDetails, setPetDetails] = useState({
    name: "",
    type: "",
    age: "",
    health: "",
    nextVetAppointment: "",
    vaccinations: "",
    userPetImage: "",
  })
  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setToken(sessionStorage.getItem('token'))
    }
  }, [])
  useEffect(() => {
    if (petDetails.userPetImage) {
      const previewURL = URL.createObjectURL(petDetails.userPetImage);
      setPetImagePreview(previewURL);

      // Cleanup to avoid memory leaks
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [petDetails.userPetImage]);
  const userPets = [
    {
      id: 1,
      name: " Bella",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAIBDcG2PHHgHsDI4slJuCUy4JlHzoFmyKxA&s",
      type: " Cat",
      age: " 2 months",
      health: " Healthy",
      nextVetAppointment: " June 15, 2025",
      vaccinations: " Rabies, Distemper",
    },
    {
      id: 2,
      img: "data:image/jpeg;base64,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",
      name: " Max",
      type: " Dog",
      age: " 4 years",
      health: " Under medication for arthritis",
      nextVetAppointment: " May 10, 2025",
      vaccinations: " Rabies, Parvovirus",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMissingPopup(true);
      setShowAdoptPopup(true);

      const hideTimeout = setTimeout(() => {
        setShowMissingPopup(false);
        setShowAdoptPopup(false);
      }, 10000); // show for 4 seconds

      return () => clearTimeout(hideTimeout);
    }, 12000); // repeat every 20 seconds

    return () => clearInterval(interval);
  }, []);
  const addPet = async () => {
    const { name, type, age, health, nextVetAppointment, vaccinations, userPetImage } = petDetails
    if (!name || !type | !age || !health || !nextVetAppointment || !vaccinations || !userPetImage) {
      toast.warning("Please fill the form completely")
    }
    else {
      const reqBody = new FormData()
      reqBody.append("name", name)
      reqBody.append("type", type)
      reqBody.append("age", age)
      reqBody.append("health", health)
      reqBody.append("nextVetAppointment", nextVetAppointment)
      reqBody.append("vaccinations", vaccinations)
      reqBody.append("userPetImage", userPetImage)
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
      const result = await addUserPetApi(reqBody, reqHeader)
      console.log("Result:", result)
    }
  }
  return (
    <div className="container py-5 text-center position-relative">
      <h2 className="mb-3">Welcome back, {user?.username.toUpperCase() || "Pet Lover"}! 🐾</h2>
      <p className="lead">We're glad to see you again! Here's what you can do today:</p>

      {/* User Pets Section */}
      <div className="my-5">
        <h4 className="mb-4">🐕‍🦺 Your Pets</h4>
        <div className="row justify-content-center">
          {userPets.map((pet) => (
            <div className="col-md-4 mb-3" key={pet.id}>
              <div className="card shadow-lg rounded-lg overflow-hidden border-0 bg-white">
                <img
                  src={pet.img} // Dynamic image source
                  alt={pet.name}
                  className="card-img-top"
                  style={{ width: '200', height: "200px", objectFit: "cover" }}
                />
                <div className="card-body p-4">
                  <h5 className="card-title text-dark font-weight-bold">{pet.name}</h5>
                  <p className="card-text text-muted">
                    <span className="d-flex align-items-center">
                      <i className="fas fa-paw text-primary me-2"></i>
                      <strong>Type:</strong> {pet.type}
                    </span>
                    <span className="d-flex align-items-center">
                      <i className="fas fa-birthday-cake text-warning me-2"></i>
                      <strong>Age:</strong> {pet.age}
                    </span>
                    <span className="d-flex align-items-center">
                      <i className="fas fa-heartbeat text-danger me-2"></i>
                      <strong>Health:</strong> {pet.health}
                    </span>
                    <div>
                      <span className="d-flex align-items-center">
                        <i className="fas fa-calendar-day text-success me-2"></i>
                        <strong>Next Vet Appointment:</strong>  {pet.nextVetAppointment}
                      </span>
                      <span className="d-flex align-items-center">
                        <i className="fas fa-syringe text-info me-2"></i>
                        <strong>Vaccinations: </strong>  {pet.vaccinations}
                      </span>
                    </div>
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 text-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleShow}
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4 mb-4">
        <Button variant="warning" onClick={() => setShowAddPetModal(true)}>Add a New Pet</Button>
      </div>


      {/* 🔔 Missing Pet Popup */}
      <div
        className={`popup ${showMissingPopup ? "show" : ""}`}
        style={{
          position: "fixed",
          bottom: "100px",
          left: "20px",
          zIndex: 999,
          border: "2px solid red",
          borderRadius: "10px",
          background: "#fff",
          padding: "10px",
          width: "200px",
        }}
      >
        <h6>🚨 MISSING!</h6>
        <img
          src="http://localhost:5173/src/assets/tabby-cat.jpg"
          alt="Missing Pet"
          onClick={() => navigate("/lost-pets")}
          style={{ cursor: "pointer", width: "100%", borderRadius: "8px" }}
        />
      </div>

      {/* 🐶 Adoptable Pet Popup */}
      <div
        className={`popup ${showAdoptPopup ? "show" : ""}`}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          zIndex: 999,
          border: "2px solid green",
          borderRadius: "10px",
          background: "#fff",
          padding: "10px",
          width: "200px",
        }}
      >
        <h6>🐶 ADOPT!</h6>
        <img
          src="http://localhost:5173/src/assets/golden-retriever.jpg"
          alt="Adoptable Pet"
          onClick={() => navigate("/adopt-pets")}
          style={{ cursor: "pointer", width: "100%", borderRadius: "8px" }}
        />
      </div>

      <Modal show={showAddPetModal} onHide={() => setShowAddPetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ADD A NEW PET</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="newPetName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={petDetails.name} onChange={(e) => setPetDetails({ ...petDetails, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPetType">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="Type" value={petDetails.type} onChange={(e) => setPetDetails({ ...petDetails, type: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPetAge">
              <Form.Label>Age</Form.Label>
              <Form.Control type="text" placeholder="Age" value={petDetails.age} onChange={(e) => setPetDetails({ ...petDetails, age: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPetHealth">
              <Form.Label>Health</Form.Label>
              <Form.Control type="text" placeholder="Health" value={petDetails.health} onChange={(e) => setPetDetails({ ...petDetails, health: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPetVet">
              <Form.Label>Next Vet Appointment</Form.Label>
              <Form.Control type="date" value={petDetails.nextVetAppointment} onChange={(e) => setPetDetails({ ...petDetails, nextVetAppointment: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPetVaccinations">
              <Form.Label>Vaccinations</Form.Label>
              <Form.Control type="text" placeholder="Vaccinations" value={petDetails.vaccinations} onChange={(e) => setPetDetails({ ...petDetails, vaccinations: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPetImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPetDetails({ ...petDetails, userPetImage: e.target.files[0] })
                }
              />
              {petImagePreview && (
                <img
                  src={petImagePreview}
                  alt="Preview"
                  className="w-100 mt-2 rounded"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={addPet}>
            Add Pet
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>EDIT YOUR PET'S DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="Type" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Age</Form.Label>
              <Form.Control type="text" placeholder="Age" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Health</Form.Label>
              <Form.Control type="text" placeholder="Health" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Next Vet Appointment</Form.Label>
              <Form.Control type="date" placeholder="Next Vet Appointment" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Vaccinations</Form.Label>
              <Form.Control type="text" placeholder="Vaccinations" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file" id='projectImg' style={{ display: 'none' }} onChange={(e) => setPetDetails({ ...petDetails, userPetImage: e.target.files[0] })}
              />
              {petImage && (
                <>
                  <Form.Text className="text-muted">
                    Selected file: {petImage.name}
                  </Form.Text>
                  <div className="mt-2">
                    <img
                      src={petImagePreview}
                      alt="Pet Preview"
                      style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                </>
              )}
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default UserHome;
