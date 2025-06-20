import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.css";
import { getAllAdoptRequestApi, getAllPetDetailsApi, getAllUserDetailsApi, getLostPetApi } from "../services/allApi";
import UserTable from "../components/UserTable";
import PetsTable from "../components/PetsTable";
import LostPetsTable from "../components/LostPetsTable";
import PetAdoptionTable from "../components/PetAdoptionTable";

function AdminPanel() {
    const [selectedSection, setSelectedSection] = useState("dashboard")
    const [counts, setCounts] = useState({
        users: 0,
        pets: 0,
        lostPets: 0,
        adoptions: 0,
        hotspots: {},
    });

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const reqHeader = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

            const usersRes = await getAllUserDetailsApi(reqHeader);
            const users = usersRes?.data || [];
            const normalUsers = users.filter(user => user.username !== "admin" && user.username !== "shelter");
            const shelters = users.filter(user => user.username === "shelter");

            const petsRes = await getAllPetDetailsApi(reqHeader);
            const pets = petsRes?.data || [];

            const lostPetsRes = await getLostPetApi(reqHeader);
            const lostPets = lostPetsRes?.data || [];

            const adoptionsRes = await getAllAdoptRequestApi(reqHeader);
            const adoptions = adoptionsRes?.data || [];

            // Count most reported locations
            const locationFrequency = {};
            lostPets.forEach(pet => {
                const loc = pet.location || "Unknown";
                locationFrequency[loc] = (locationFrequency[loc] || 0) + 1;
            });

            setCounts({
                users: normalUsers.length,
                shelters: shelters.length,
                pets: pets.length,
                lostPets: lostPets.length,
                adoptions: adoptions.length,
                hotspots: locationFrequency,
            });
        } catch (err) {
            console.error("Error fetching dashboard stats", err);
            setCounts({
                users: 0,
                shelters: 0,
                pets: 0,
                lostPets: 0,
                adoptions: 0,
                hotspots: {},
            });
        }
    };
    return (
        <Container fluid className="admin-panel">
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar">
                    <h3 className="text-center">Admin Panel</h3>
                    <ul className="sidebar-menu">
                        <li className={selectedSection === "dashboard" ? "active" : ""} onClick={() => setSelectedSection("dashboard")}>Dashboard</li>
                        <li className={selectedSection === "users" ? "active" : ""} onClick={() => setSelectedSection("users")}>Manage Users</li>
                        <li className={selectedSection === "pets" ? "active" : ""} onClick={() => setSelectedSection("pets")}>Manage Pets</li>
                        <li className={selectedSection === "lostAndFoundPets" ? "active" : ""} onClick={() => setSelectedSection("lostAndFoundPets")}>Lost & Found Pets</li>
                        <li className={selectedSection === "adoptions" ? "active" : ""} onClick={() => setSelectedSection("adoptions")}>Approve Adoptions</li>
                    </ul>
                </Col>

                {/* Main Content */}
                <Col md={9} className="admin-content">
                    {selectedSection === "dashboard" && (
                        <>
                            <h2 className="mb-4">📊 Admin Dashboard</h2>
                            <Row className="mb-4">
                                <Col md={3}><Card body>👤 Users: {counts.users}</Card></Col>
                                <Col md={3}><Card body>🏠 Shelters: {counts.shelters}</Card></Col>
                                <Col md={3}><Card body>🐾 Pets: {counts.pets}</Card></Col>
                                <Col md={3}><Card body>🆘 Lost Pets: {counts.lostPets}</Card></Col>
                                <Col md={3}><Card body>❤️ Adoption Requests: {counts.adoptions}</Card></Col>
                            </Row>

                            <h4 className="mt-5">🔥 Most Reported Locations </h4>
                            <ul>
                                {Object.entries(counts.hotspots).map(([location, count]) => (
                                    <li key={location}> 📍 {location}: {count} reports</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {selectedSection === "users" && (
                        <UserTable />
                    )}

                    {selectedSection === "pets" && (
                        <PetsTable />
                    )}

                    {selectedSection === "lostAndFoundPets" && (
                        <LostPetsTable />
                    )}

                    {selectedSection === "adoptions" && (
                        <PetAdoptionTable />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPanel;
