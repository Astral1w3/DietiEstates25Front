import React, { useState } from 'react';
import './ChangePasswordForm.css'; // Creeremo questo file CSS

const ChangePasswordForm = () => {
    // Stato per i valori degli input
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Stato per i messaggi di successo o errore
    const [message, setMessage] = useState({ text: '', type: '' }); // type può essere 'success' o 'error'
    
    // Stato per gestire il caricamento durante la sottomissione
    const [isLoading, setIsLoading] = useState(false);

    // Gestore per aggiornare lo stato quando l'utente digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Gestore per la sottomissione del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' }); // Resetta i messaggi precedenti

        // 1. Validazione lato client
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setMessage({ text: 'Please fill in all fields.', type: 'error' });
            return;
        }
        if (passwords.newPassword.length < 8) {
            setMessage({ text: 'New password must be at least 8 characters long.', type: 'error' });
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }

        setIsLoading(true);

        // 2. Simulazione di una chiamata API
        // In un'app reale, qui faresti una richiesta al tuo backend.
        // Esempio: await api.changePassword({ ...passwords });
        setTimeout(() => {
            // Simuliamo una risposta di successo
            if (passwords.currentPassword === "password123") { // Simula una password corrente corretta
                setMessage({ text: 'Password changed successfully!', type: 'success' });
                // Svuota i campi dopo il successo
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                // Simuliamo una risposta di errore
                setMessage({ text: 'The current password you entered is incorrect.', type: 'error' });
            }
            setIsLoading(false);
        }, 1500); // Ritardo di 1.5 secondi per simulare la rete
    };

    return (
        <div className="card">
            <h2>Change Your Password</h2>
            <hr />
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group full-width">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        required
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
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;