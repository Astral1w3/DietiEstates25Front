import React, { useState } from 'react';
import './CreateUserForm.css'; // Creeremo questo file CSS

const CreateUserForm = ({ roleToCreate }) => {
    // Stato per i dati del nuovo utente
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // Stati per il feedback e il caricamento
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Gestore per l'aggiornamento degli input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Funzione per validare un'email
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    // Gestore per la sottomissione del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // 1. Validazione dei dati
        if (!formData.username || !formData.email || !formData.password) {
            setMessage({ text: 'All fields are required.', type: 'error' });
            return;
        }
        if (!validateEmail(formData.email)) {
            setMessage({ text: 'Please enter a valid email address.', type: 'error' });
            return;
        }
        if (formData.password.length < 8) {
            setMessage({ text: 'Password must be at least 8 characters long.', type: 'error' });
            return;
        }

        setIsLoading(true);

        // 2. Simulazione di una chiamata API per creare l'utente
        console.log('Creating new user:', { ...formData, role: roleToCreate.toLowerCase() });

        setTimeout(() => {
            // Simuliamo una risposta di successo dall'API
            setMessage({ 
                text: `${roleToCreate} "${formData.username}" created successfully!`, 
                type: 'success' 
            });
            
            // Svuota il form dopo il successo
            setFormData({ username: '', email: '', password: '' });
            setIsLoading(false);

            // In caso di errore reale, faresti:
            // setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
            // setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="create-user-card">
            <h2>Create New {roleToCreate}</h2>
            <hr />
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group full-width">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Min. 8 characters"
                    />
                </div>

                {/* Mostra i messaggi di feedback */}
                {message.text && (
                    <div className={`form-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Creating...' : `Create ${roleToCreate}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;