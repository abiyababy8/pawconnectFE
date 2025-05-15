import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container d-flex justify-content-center align-items-center flex-column text-center">
      
      {/* Hero Section */}
      <h1 className="home-title">Welcome to PawConnect <i className="fa-solid fa-paw"></i></h1>
      <p className="home-subtitle">
        Connecting loving pet owners with adorable furry friends.
      </p>

      {/* About Section */}
      <div className="home-content p-3">
        <p>
          PawConnect is a dedicated platform designed to bring pet lovers together.
          Whether you're looking to adopt a new pet, find lost pets, we've got you covered!
        </p>
        <p>
          Join our growing community to ensure every pet finds a loving home.
        </p>
      </div>

      {/* Call to Action */}
      <Link to="/login" className="home-button">Explore Available Pets 🐶🐱</Link>
    </div>
  );
}

export default Home;
