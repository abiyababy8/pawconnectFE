import React, { useEffect, useState } from 'react'
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { deleteUserApi, editUserApi, editUserRoleApi, getAllUserDetailsApi, registerApi } from '../services/allApi';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([])
    const [newShelters, setNewShelters] = useState({
        name: '', username: '', email: '', phone: '', password: '', role: 'shelter'
    })
    const [editShelters, setEditShelters] = useState({
        id: '', name: '', username: '', email: '', phone: '', password: ''
    })

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showEditShelter, setShowEditShelter] = useState(false);
    const handleCloseEditShelter = () => setShowEditShelter(false);
    const handleShowEditShelter = () => setShowEditShelter(true);
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
                user => user.role === 'user'
            )
            setUsers(filteredUsers)
            const filteredShelters = result.data.filter(
                user => user.role === 'shelter'
            )
            setShelters(filteredShelters)
        } catch (error) {
            console.log("Something Happened", error)
        }
    }
    useEffect(() => {
        getUsers()
    }, [])
    const handleEditUser = async (id, role) => {
        if(window.confirm(`Are you sure you want to change the user's role to shelter?`)){
            try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await editUserRoleApi(id, role, reqHeader)
            getUsers()
        } catch (error) {
            console.log(error)
        }
        }
    }
    const handleDeleteUser = async (id) => {
        try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await deleteUserApi(id, reqHeader)
            console.log("Deleting User...")
            console.log(result)
            getUsers()
        } catch (error) {
            console.log(error)
        }
    }
    const handleAddShelter = async () => {
        try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await registerApi(newShelters, reqHeader)
            console.log("Adding Shelter...")
            console.log(result)
            handleClose()
            getUsers()
        } catch (error) {
            console.log(error)
        }
    }
    const handleEditShelter = async (id) => {
        try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await editUserApi(id, editShelters, reqHeader)
            handleCloseEditShelter()
            getUsers()
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteShelter = async (id) => {
        try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await deleteUserApi(id, reqHeader)
            console.log("Deleting Shelter...")
            console.log(result)
            getUsers()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h4>Manage Users</h4>
            {
                users.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
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
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => { const updatedRole = 'shelter'; handleEditUser(user._id, updatedRole) }}>Make Shelter</Button>{' '}
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table> : <p>NO USER DETAILS FOUND!</p>
            }
            <h4>Manage Shelters</h4>
            {
                shelters.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                shelters.map((shelter) => (
                                    <tr >
                                        <td>{shelter.name}</td>
                                        <td>{shelter.username}</td>
                                        <td>{shelter.email}</td>
                                        <td>{shelter.phone}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => {
                                                handleShowEditShelter()
                                                setEditShelters(
                                                    {
                                                        id: shelter._id,
                                                        name: shelter.name,
                                                        username: shelter.username,
                                                        email: shelter.email,
                                                        phone: shelter.phone,
                                                        password: shelter.password

                                                    })
                                            }}>Edit Shelter</Button>{' '}
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteShelter(shelter._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table> : <p>NO SHELTER DETAILS FOUND!</p>
            }
            <Button variant='primary' onClick={handleShow}>Add New Shelter</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ADD A NEW SHELTER</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={newShelters.name} onChange={(e) => { setNewShelters({ ...newShelters, name: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" value={newShelters.username} onChange={(e) => { setNewShelters({ ...newShelters, username: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={newShelters.email} onChange={(e) => { setNewShelters({ ...newShelters, email: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="number" placeholder="Phone number" value={newShelters.phone} onChange={(e) => { setNewShelters({ ...newShelters, phone: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={newShelters.password} onChange={(e) => { setNewShelters({ ...newShelters, password: e.target.value }) }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleAddShelter}>
                        Add Shelter
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* edit shelter  */}
            <Modal show={showEditShelter} onHide={handleCloseEditShelter}>
                <Modal.Header closeButton>
                    <Modal.Title>EDIT SHELTER DETAILS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={editShelters.name} onChange={(e) => { setEditShelters({ ...editShelters, name: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" value={editShelters.username} onChange={(e) => { setEditShelters({ ...editShelters, username: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={editShelters.email} onChange={(e) => { setEditShelters({ ...editShelters, email: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="number" placeholder="Phone number" value={editShelters.phone} onChange={(e) => { setEditShelters({ ...editShelters, phone: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={editShelters.password} onChange={(e) => { setEditShelters({ ...editShelters, password: e.target.value }) }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => handleEditShelter(editShelters.id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserTable