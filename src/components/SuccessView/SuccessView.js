import React from 'react';
import './SuccessView.css'; // Importiamo il suo CSS dedicato

// L'icona SVG fa parte di questo componente
const SuccessIcon = () => (
    <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="success-icon__circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="success-icon__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
);

/**
 * Un componente riutilizzabile per mostrare un messaggio di successo con un'icona animata.
 * @param {object} props
 * @param {string} props.title - Il titolo da mostrare (es. "Richiesta Inviata!").
 * @param {React.ReactNode} props.children - Il contenuto del messaggio, può essere testo o altro JSX.
 */
const SuccessView = ({ title = "Operazione Completata!", children }) => {
    return (
        <div className="success-view-container">
            <SuccessIcon />
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
};

export default SuccessView;