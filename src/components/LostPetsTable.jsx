import React, { useEffect, useState } from 'react'
import { deleteLostPetApi, getLostPetApi, updateLostPetStatusApi } from '../services/allApi';
import { Button, Table } from 'react-bootstrap';

function LostPetsTable() {
    const [lostAndFoundPets, setLostAndFoundPets] = useState([]);
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
    useEffect(() => {
        getLostPets()
    }, [])
    const handleApprovePet = async (id, status) => {
        try {
            const token = sessionStorage.getItem("token");
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const result = await updateLostPetStatusApi(id, status, headers)
            getLostPets()
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteLostFoundPet = async (id) => {
        try {
            const token = sessionStorage.getItem('token')
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await deleteLostPetApi(id, reqHeader)
            getLostPets()
        } catch (error) {
            console.log(error)
        }
    }
    return (
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
                                                    <Button variant="success" size="sm" onClick={() => { const updatedStatus = 'Found'; handleApprovePet(pet._id, updatedStatus) }}>Approve</Button>{' '}
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteLostFoundPet(pet.id)}>Reject</Button>{' '}
                                                </>
                                            )}
                                            {pet.status === "Found" && (
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteLostFoundPet(pet._id)}>Delete</Button>
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
    )
}

export default LostPetsTable