import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { deleteUserPetApi, editUserPetStatusApi, getAllPetDetailsApi } from '../services/allApi';
import { toast } from 'react-toastify';
function PetsTable() {
    const [pets, setPets] = useState([]);
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
    useEffect(() => {
        getPets()
    }, [])
    const handleApprovePet = async (id, data) => {
        if (window.confirm('Are you sure you want to approve this pet?')) {
            try {
                const token = sessionStorage.getItem("token");
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                const result = await editUserPetStatusApi(id, data, headers)
                if (result.status === 200) {
                    toast.success('Approved the pet successfully!')
                    getPets()
                }
            } catch (error) {
                toast.error('Some error occured')
                console.log(error)
            }
        }
    }
    const handleDeletePet = async (id) => {
        if (window.confirm('Are you sure you want to delete this pet?')) {
            try {
                const token = sessionStorage.getItem('token')
                const reqHeader = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                const result = await deleteUserPetApi(id, reqHeader)
                if (result.status) {
                    toast.success("Deleted the pet successfully!")
                    getPets()
                }
            } catch (error) {
                toast.error('Some error occured')
                console.log(error)
            }
        }
    }
    return (
        <>
            <h4>Manage Pets</h4>
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
                                            <td>{pet.userId?.name || 'Unknown'}</td>
                                            <td>
                                                {
                                                    pet.status === 'approved' ?
                                                        <Button variant="danger" size="sm" onClick={() => handleDeletePet(pet._id)}>Delete</Button>
                                                        :
                                                        <>
                                                            <Button variant="success" size="sm" onClick={() => { const updatedStatus = "approved"; handleApprovePet(pet._id, updatedStatus) }}>Approve</Button>{' '}
                                                            <Button variant="danger" size="sm" onClick={() => handleDeletePet(pet._id)}>Reject</Button>
                                                        </>
                                                }
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
    )
}

export default PetsTable