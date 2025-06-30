import { React, useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { isAuthTokenContext } from '../Context/ContextShare';

function Nav() {
    const { isAuthToken, setIsAuthToken } = useContext(isAuthTokenContext)
    const [showDropDown, setShowDropDown] = useState(false);
    const dropdownRef = useRef(null);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = user?.role;
    const username = user?.name;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="nav-bar d-flex justify-content-between">
                <div className='d-flex align-items-center'>
                    <i className="fa-solid fa-paw nav-bar-brand fa-beat mt-2 me-2 ms-2 "></i>
                    <h4 className='mt-3'>PawConnect</h4>
                </div>
                <div className="d-flex align-items-center user-dropdown position-relative" ref={dropdownRef}>
                    <i
                        className="fa-solid fa-user"
                        onClick={() => setShowDropDown(!showDropDown)}
                        style={{ cursor: 'pointer' }}
                    ></i>
                    <br />
                    {isAuthToken && (
                        <span className='me-2'>
                            {role === 'admin' ? 'Hi, Admin' : username ? `Hi, ${username}` : ''}
                        </span>
                    )}

                    {showDropDown && (
                        <div className="dropdown-menu-custom">
                            {isAuthToken ? (
                                role === 'user' ? (
                                    <>
                                        <Link to="/user-home" className="dropdown-items">Home</Link>
                                        <Link to="/profile" className="dropdown-items">My Profile</Link>
                                        <Link to="/" className="dropdown-items" onClick={() => {
                                            sessionStorage.clear();
                                            setIsAuthToken(false);
                                        }}>Log Out <i className="fa-solid fa-arrow-up-right-from-square"></i></Link>
                                    </>
                                ) : (
                                    // for admin or shelter
                                    <Link to="/" className="dropdown-items" onClick={() => {
                                        sessionStorage.clear();
                                        setIsAuthToken(false);
                                    }}>Log Out <i className="fa-solid fa-arrow-up-right-from-square"></i></Link>
                                )
                            ) : (
                                <Link to="/login" className="dropdown-items">Log In  <i className="fa-solid fa-arrow-up-right-from-square"></i></Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Nav;
