import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../services/allApi';
import { toast, ToastContainer } from 'react-toastify';

function Register() {
    const [data, setData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        let valid = true;
        let newErrors = { username: '', email: '', phone: '', password: '', confirmPassword: '' };

        if (data.username.trim() === '') {
            newErrors.username = 'Username is required.';
            valid = false;
        }

        if (data.email.trim() === '') {
            newErrors.email = 'Email is required.';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Invalid email format.';
            valid = false;
        }

        if (data.phone.trim() === '') {
            newErrors.phone = 'Phone number is required.';
            valid = false;
        } else if (data.phone.trim().length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits long.';
            valid = false;
        } else if (!/^[789]\d{9}$/.test(data.phone.trim())) {
            newErrors.phone = 'Invalid Indian phone number format. It should start with 7, 8, or 9 and be 10 digits long.';
            valid = false;
        }


        if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
            valid = false;
        }

        if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const result = await registerApi(data)
            if (result.status === 201) {
                toast.success('Registered Successfully!');
                navigate('/login');
            }
            else if(result.status===401){
                toast.error('Something Happened!')
            }

        }
        else {
            toast.error("Something Bad Happened!")
        }
    };
    const handleClear = () => {
        setData({
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
    };


    return (
        <div className="container">
            <div className="row mt-5 mb-5">
                <div className="col-md-3"></div>
                <div className="col-md-6 border border-secondary p-5 rounded">
                    <h3 className="text-center mb-4" style={{ color: '#FF914D' }}>Create an Account</h3>
                    <Form onSubmit={handleRegister}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Username:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    name="username"
                                    value={data.username}
                                    onChange={handleInputChange}
                                />
                                {errors.username && <small className="text-danger">{errors.username}</small>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Email:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleInputChange}
                                />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Phone:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    value={data.phone}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && <small className="text-danger">{errors.phone}</small>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Password:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleInputChange}
                                />
                                {errors.password && <small className="text-danger">{errors.password}</small>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Confirm Password:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleInputChange}
                                />
                                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                            </Col>
                        </Form.Group>

                        <p className="text-center">Already registered? <a href="/login">Login here</a></p>

                        <Form.Group as={Row} className="mb-3">
                            <Col className="d-flex justify-content-end">
                                <Button variant="warning" type="button" onClick={handleClear} className='me-2'>Clear</Button>
                                <Button variant="primary" type="submit">Register</Button>
                            </Col>
                        </Form.Group>

                    </Form>
                </div>
                <div className="col-md-3"></div>
            </div>
            <ToastContainer
                autoclose={1000} />
        </div>

    );
}

export default Register;
