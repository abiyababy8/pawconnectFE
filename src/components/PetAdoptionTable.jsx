import React, { useEffect, useState } from 'react'
import { deleteAdoptRequestApi, getAllAdoptRequestApi, updateAdoptRequestStatusApi } from '../services/allApi';
import { Button, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

function PetAdoptionTable() {
    const [adoptions, setAdoptions] = useState([]);
    const getAdoptionRequests = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const result = await getAllAdoptRequestApi(reqHeader)
            console.log("Adoption Requests:")
            console.log(result.data)
            setAdoptions(result.data)
        } catch (error) {
            console.log("Something Happened", error)
        }
    }
    useEffect(() => {
        getAdoptionRequests()
    }, [])
    const handleApproveAdoptionRequest = async (id, status) => {
        if (window.confirm("Are you sure you want to approve this adoption request?")) {
            try {
                const token = sessionStorage.getItem("token");
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                const result = await updateAdoptRequestStatusApi(id, status, headers)
                if (result.status===200) {
                    toast.success('Approved Adoption request successfully!')
                    getAdoptionRequests()
                }
            } catch (error) {
                toast.error('Some error occured')
                console.log(error)
            }
        }

    }
    const handleDeleteAdoptionRequest = async (id) => {
        if (window.confirm("Are you sure you want to delete this adoption request?")) {
            try {
                const token = sessionStorage.getItem('token')
                const reqHeader = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                const result = await deleteAdoptRequestApi(id, reqHeader)
                if (result.status === 200) {
                    toast.success('Deleted the Adoption request successfully!')
                    getAdoptionRequests()
                }
                
            } catch (error) {
                toast.error('Some error occured')
                console.log(error)
            }
        }

    }
    return (
        <>
            <h4>Approve Adoptions</h4>
            {
                adoptions.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>

                                <th>Pet Name</th>
                                <th>Type</th>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Donation (₹)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adoptions.map((adoption) => (
                                <tr>

                                    <td>{adoption.pet.name}</td>
                                    <td>{adoption.pet.type}</td>
                                    <td>{adoption.name}</td>
                                    <td>{adoption.contact}</td>
                                    <td>{adoption.donation}</td>
                                    <td>{adoption.status}</td>
                                    <td>
                                        {adoption.status === "Request submitted" && (
                                            <>
                                                <Button variant="success" size="sm" className="me-1" onClick={() => { const updatedStatus = 'Approved'; handleApproveAdoptionRequest(adoption._id, updatedStatus) }}>Approve</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteAdoptionRequest(adoption._id)}>Reject</Button>
                                            </>
                                        )}
                                        {adoption.status === "Approved" && (
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteAdoptionRequest(adoption._id)}>Delete</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table> : <p>NO ADOPTION REQUESTS FOUND!</p>
            }
        </>
    )
}

export default PetAdoptionTable