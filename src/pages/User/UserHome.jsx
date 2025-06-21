import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userhome.css"; // Import CSS for popup animation
import { Modal, Button, Form } from 'react-bootstrap'
import { toast, ToastContainer } from "react-toastify";
import { addUserPetApi, getUserPetApi, editUserPetApi, deleteUserPetApi } from "../../services/allApi";
import { base_url } from "../../services/base_url";

function UserHome() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const [showMissingPopup, setShowMissingPopup] = useState(false);
  const [showAdoptPopup, setShowAdoptPopup] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [petImagePreview, setPetImagePreview] = useState(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [token, setToken] = useState("")
  const [userPet, setUserPet] = useState([])
  const [petDetails, setPetDetails] = useState({
    name: "",
    type: "",
    age: "",
    health: "",
    nextVetAppointment: "",
    vaccinations: "",
    userPetImage: "",
    status:''
  })
  const [editPetDetails, setEditPetDetails] = useState({
    name: "",
    type: "",
    age: "",
    health: "",
    nextVetAppointment: "",
    vaccinations: "",
    userPetImage: "",
  })
  const [editPetImagePreview, setEditPetImagePreview] = useState(null);

  useEffect(() => {
    // If user uploads a new image file
    if (editPetDetails.userPetImage instanceof File) {
      const previewURL = URL.createObjectURL(editPetDetails.userPetImage);
      setEditPetImagePreview(previewURL);

      // Cleanup to avoid memory leaks
      return () => URL.revokeObjectURL(previewURL);
    } else if (typeof editPetDetails.userPetImage === 'string') {
      // If it's an existing image URL (from DB)
      setEditPetImagePreview(editPetDetails.userPetImage);
    } else {
      // No image selected
      setEditPetImagePreview(null);
    }
  }, [editPetDetails.userPetImage]);

  console.log("Edit Details:", editPetDetails)
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
  const getUserPet = async () => {
    const token = sessionStorage.getItem("token")
    const requestHeader = {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${token}`
    }
    const result = await getUserPetApi(requestHeader)
    console.log("User Pets:", result.data)
    setUserPet(result.data)
  }
  useEffect(() => {
    getUserPet()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMissingPopup(true);
      setShowAdoptPopup(true);

      const hideTimeout = setTimeout(() => {
        setShowMissingPopup(false);
        setShowAdoptPopup(false);
      }, 5000); // show for 4 seconds

      return () => clearTimeout(hideTimeout);
    }, 5000); // repeat every 20 seconds

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
      setShowAddPetModal(false)
      getUserPet()
    }
  }
  const handleEditUserPet = async () => {
    const { name, type, age, health, nextVetAppointment, vaccinations, userPetImage, id } = editPetDetails;

    if (!name || !type || !age || !health || !nextVetAppointment || !vaccinations) {
      toast.warning("Please fill the form completely!");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("name", name);
    reqBody.append("type", type);
    reqBody.append("age", age);
    reqBody.append("health", health);
    reqBody.append("nextVetAppointment", nextVetAppointment);
    reqBody.append("vaccinations", vaccinations);

    // Only append file if it's a new File object
    if (editPetDetails.userPetImage instanceof File) {
      reqBody.append("userPetImage", userPetImage);
    }

    const reqHeader = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    };

    try {
      const result = await editUserPetApi(id, reqBody, reqHeader); // You need to implement this API in your `allApi.js`
      if (result.status === 200) {
        toast.success(`${name}'s details updated successfully!`);
        setShow(false);
        getUserPet(); // Refresh the pet list
      } else {
        toast.error("Update failed. Try again!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };
  const handleDelete = async (Id) => {
    const token = sessionStorage.getItem("token")
    const reqHeader = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
    const result = await deleteUserPetApi(Id, reqHeader)
    if (result.status === 200) {
      console.log("Delete Status:", result)
      toast.success(`${result.data.name} deleted successfully!`)
      getUserPet()

    }
    else {
      toast.error("Something Happened! Cannnot Delete!")
    }
  }

  return (
    <div className="container py-5 text-center position-relative">
      <h2 className="mb-3">Welcome back, {user?.username.toUpperCase() || "Pet Lover"}! 🐾</h2>
      <p className="lead">We're glad to see you again! Here's what you can do today:</p>

      {/* User Pets Section */}
      <div className="my-5">
        <h4 className="mb-4">🐕‍🦺 Your Pets</h4>
        <div className="row justify-content-center p-5">
          {userPet?.length > 0 ?
            userPet.map((pet) => (
              <div className="col-md-4 mb-3" key={pet.id}>
                <div className="card shadow-lg rounded-lg overflow-hidden border-0 bg-white" style={{ width: "330px" }}>
                  <img
                    src={`${base_url}/uploads/${pet.userPetImage}`} // Dynamic image source
                    alt={pet.name}
                    className="card-img-top"
                    style={{ width: '200', height: "200px", objectFit: "fixed" }}
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
                      className="btn btn-outline-success btn-sm"
                      onClick={() => {
                        setShow(true)
                        setEditPetDetails({
                          id: pet._id,
                          name: pet.name,
                          type: pet.type,
                          age: pet.age,
                          health: pet.health,
                          nextVetAppointment: pet.nextVetAppointment,
                          vaccinations: pet.vaccinations,
                          userPetImage: pet.userPetImage ? `${base_url}/uploads/${pet.userPetImage}` : pet.userPetImage,
                        });
                      }}
                    >
                      Edit Details
                    </button>
                    <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleDelete(pet._id)}>Delete</button>
                  </div>
                </div>
              </div>
            )) : <p>NO PETS FOUND!</p>}
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
          width: "150px",
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
          width: "150px",
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
          <Button variant="warning" onClick={addPet}>
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
              <Form.Control type="text" placeholder="Name" value={editPetDetails.name} onChange={(e) => setEditPetDetails({ ...editPetDetails, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="Type" value={editPetDetails.type} onChange={(e) => setEditPetDetails({ ...editPetDetails, type: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Age</Form.Label>
              <Form.Control type="text" placeholder="Age" value={editPetDetails.age} onChange={(e) => setEditPetDetails({ ...editPetDetails, age: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Health</Form.Label>
              <Form.Control type="text" placeholder="Health" value={editPetDetails.health} onChange={(e) => setEditPetDetails({ ...editPetDetails, health: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Next Vet Appointment</Form.Label>
              <Form.Control type="date" placeholder="Next Vet Appointment" value={editPetDetails.nextVetAppointment} onChange={(e) => setEditPetDetails({ ...editPetDetails, nextVetAppointment: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Vaccinations</Form.Label>
              <Form.Control type="text" placeholder="Vaccinations" value={editPetDetails.vaccinations} onChange={(e) => setEditPetDetails({ ...editPetDetails, vaccinations: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPetImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditPetDetails({
                    ...editPetDetails,
                    userPetImage: e.target.files[0],
                  })
                }
              />

              {/* Image Preview */}
              {editPetImagePreview && (
                <img
                  src={editPetImagePreview}
                  alt="Preview"
                  className="w-100 mt-2 rounded"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleEditUserPet}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default UserHome;
