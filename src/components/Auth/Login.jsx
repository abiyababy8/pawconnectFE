import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../../services/allApi';
import { toast, ToastContainer } from 'react-toastify';

function Login() {
    const [data, setData] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        username: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });

        // Clear errors when user starts typing
        setErrors({ ...errors, [name]: "" });
    };

    const navigate = useNavigate()

    const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = data;

    if (!username || !password) {
        toast.warning("Please fill the form completely!");
        return;
    }

    let valid = true;
    let newErrors = { username: "", password: "" };

    if (username.trim() === "") {
        newErrors.username = "Username is required.";
        valid = false;
    }

    if (password.trim() === "") {
        newErrors.password = "Password is required.";
        valid = false;
    } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
        valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
        const result = await loginApi(data); // login API call

        if (result.status === 200) {
            const userData = result.data.user_data;
            const token = result.data.jwt_token;

            // Determine role from username
            let role = "user"; // default
            if (username === "admin") role = "admin";
            else if (username === "shelter") role = "shelter";

            const user = {
                username: userData.username,
                role: role
            };

            // Store token and role info
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("token", token);

            // Toast + navigate based on role
            toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} Login Successful!`);

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "shelter") {
                navigate("/shelterpanel");
            } else {
                navigate("/user-home");
            }

        } else if (result.status === 406) {
            toast.error("Invalid Username or Password!");
        } else {
            toast.error("Something bad happened!");
        }
    } catch (error) {
        console.error("Login API error:", error);
        toast.error("Something went wrong while logging in.");
    }
};



    const handleClear = () => {
        setData({
            username: '',
            password: ''
        });
        setErrors({
            username: '',
            password: ''
        });
    };

    return (
        <>
            <div className="container">
                <div className="row mt-5 mb-5">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 border border-secondary p-5 rounded">
                        <h3 className="text-center mb-4" style={{ color: '#FF914D' }}>Log In</h3>
                        <Form onSubmit={handleLogin}>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>Username:</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        name="username"
                                        value={data.username}
                                        onChange={handleInputChange}
                                    />
                                    {errors.username && <small className="text-danger">{errors.username}</small>}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>Password:</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={data.password}
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && <small className="text-danger">{errors.password}</small>}
                                </Col>
                            </Form.Group>

                            <p className="text-center">New here? <Link to="/register">Register here</Link></p>

                            <Form.Group as={Row} className="mb-3">
                                <Col className="d-flex justify-content-end">
                                    <Button variant="warning" type="button" onClick={handleClear} className='me-2'>Clear</Button>
                                    <Button variant="primary" type="submit">Log In</Button>
                                </Col>
                            </Form.Group>

                        </Form>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default Login;
