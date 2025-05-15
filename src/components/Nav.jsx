import { React, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
    const [showDropDown, setShowDropDown] = useState(false);
    const dropdownRef = useRef(null);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = user?.role;
    const username = user?.username.toUpperCase();

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
                <div className='d-flex'>
                    <i className="fa-solid fa-paw nav-bar-brand fa-beat mt-3 me-2 ms-2 fa-2x"></i>
                    <h3 className='mt-3'>PawConnect</h3>
                </div>
                <div className="user-dropdown position-relative" ref={dropdownRef}>
                    <i
                        className="fa-solid fa-user fa-2x"
                        onClick={() => setShowDropDown(!showDropDown)}
                        style={{ cursor: 'pointer' }}
                    ></i>
                    <br />
                    <span className='me-2'>{username}</span>
                    {showDropDown && (
                        <div className="dropdown-menu-custom">
                            {role === 'user' ? (
                                <>
                                    <Link to="/user-home" className="dropdown-items">Home</Link>
                                    <Link to="/profile" className="dropdown-items">My Profile</Link>
                                    <Link to="/" className="dropdown-items" onClick={() => sessionStorage.clear()}>Log Out</Link>
                                </>
                            ) : role === 'admin' || role === 'shelter' ? (
                                <Link to="/" className="dropdown-items" onClick={() => sessionStorage.clear()}>Log Out</Link>
                            ) : (
                                <Link to="/login" className="dropdown-items">Log In</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Nav;
