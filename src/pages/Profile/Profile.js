import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/permissions';

// Importa tutti i nuovi componenti
import ProfileMenu from '../../components/ProfileMenu/ProfileMenu';
import ViewProfileDetails from '../../components/ViewProfileDetails/ViewProfileDetails';
import AddPropertyForm from '../../components/AddPropertyForm/AddPropertyForm';
import CreateUserForm from '../../components/CreateUserForm/CreateUserForm';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import AgentDashboard from '../../components/AgentDashboard/AgentDashboard';

import './Profile.css'; // Useremo questo CSS per il layout

const ProfilePage = () => {
    const { user } = useAuth();
    // Stato per sapere quale componente mostrare a destra
    const [activeView, setActiveView] = useState('viewDetails');

    // Funzione helper per renderizzare il componente corretto
    const renderActiveView = () => {
        switch (activeView) {
            case 'viewDetails':
                return <ViewProfileDetails />;
            case 'addProperty':
                return <AddPropertyForm />;
            case 'viewDashboard':
                return <AgentDashboard />;
            case 'createAgent':
                return <CreateUserForm roleToCreate="Agent" />;
            case 'createManager':
                return <CreateUserForm roleToCreate="Manager" />;
            case 'changePassword':
                return <ChangePasswordForm />;
            default:
                return <ViewProfileDetails />;
        }
    };

    return (
        <div className="profile-page-container">
            <header className="profile-header">
                <h1>Hello, {user?.username || 'User'}!</h1>
                <p>Role: {user?.role}</p>
            </header>
            <main className="profile-main-content">
                <div className="profile-menu-container">
                    <ProfileMenu activeView={activeView} onSelectView={setActiveView} />
                </div>
                <div className="profile-view-container">
                    {renderActiveView()}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;