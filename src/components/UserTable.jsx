import React, { useEffect, useState } from 'react'
import { Button,Table } from 'react-bootstrap';
import { getAllUserDetailsApi } from '../services/allApi';

function UserTable() {
     const [users, setUsers] = useState([]);
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
                     user => user.username !== 'admin' && user.username !== 'shelter'
                 )
                 setUsers(filteredUsers)
             } catch (error) {
                 console.log("Something Happened", error)
             }
         }
         useEffect(()=>{
            getUsers()
         },[])
         const handleEditUser=async(data)=>{

         }
         const handleDeleteUser=async(id)=>{

         }
  return (
     <>
                            <h4>Manage Users</h4>
                            {
                                users.length > 0 ?
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
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
                                                        <td>{user.username}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone}</td>
                                                        <td>
                                                            <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>{' '}
                                                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table> : <p>NO USER DETAILS FOUND!</p>
                            }
                        </>
  )
}

export default UserTable