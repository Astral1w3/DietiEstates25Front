import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS, MENU_OPTIONS } from '../../config/permissions';
import './ProfileMenu.css';

const ProfileMenu = ({ activeView, onSelectView }) => {
    const { user } = useAuth();
    
    // Se non c'è un utente o un ruolo, non mostrare nulla
    if (!user || !user.role) {
        return null;
    }

    // Filtra le opzioni del menu in base ai permessi del ruolo dell'utente
    const availableOptions = PERMISSIONS[user.role] || [];

    return (
        <nav className="profile-menu">
            <ul>
                {availableOptions.map(optionKey => (
                    <li key={optionKey}>
                        <button
                            className={activeView === optionKey ? 'active' : ''}
                            onClick={() => onSelectView(optionKey)}
                        >
                            {MENU_OPTIONS[optionKey]}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ProfileMenu;