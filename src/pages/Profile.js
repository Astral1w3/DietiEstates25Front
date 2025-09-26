import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css'; // Useremo un nuovo CSS per il profilo

const Profile = () => {
    const { user } = useAuth();

    // Lo stato per i dati del form rimane lo stesso
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: user?.email || 'john@gmail.com',
    });

    return (
        // 1. Usiamo la stessa struttura della Home Page
        <div className="hero-container profile-hero"> {/* Aggiunta classe per immagine diversa */}
            <div className="hero-overlay"></div>

            {/* 2. Il contenuto principale è ora dentro "hero-content" */}
            <main className="hero-content">
                
                {/* Il titolo è l'equivalente dell'h1 della Home */}
                <h1>{user?.name || 'Jake Nackos'}</h1>

                {/* 3. La card con il form è ora l'elemento principale dentro il contenuto */}
                <div className="personal-details-card">
                    <h2>Personal details</h2>
                    <hr />
                    <form className="personal-details-form">
                        <div className="form-group">
                            <label htmlFor="firstName">First name</label>
                            <input type="text" id="firstName" value={formData.firstName} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last name</label>
                            <input type="text" id="lastName" value={formData.lastName} readOnly />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="email">Email ID</label>
                            <input type="email" id="email" value={formData.email} readOnly />
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;