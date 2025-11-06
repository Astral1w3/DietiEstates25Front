import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';

// 1. Importa i tuoi componenti personalizzati
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'; // Assicurati che il percorso sia corretto
import SuccessView from '../SuccessView/SuccessView';             // Assicurati che il percorso sia corretto

// 2. Importa le funzioni del service
import { updatePropertyState, deleteProperty } from '../../services/propertyService';
import { FaEye, FaCalendarCheck, FaFileSignature, FaBuilding, FaCheckCircle, FaTrash, FaUndo } from 'react-icons/fa';

import StatCard from '../StatCard/StatCard';
import './AgentDashboard.css';

const placeholderImage = 'https://via.placeholder.com/400x250.png?text=No+Image';

const AgentDashboard = () => {
    // Stato per i dati della dashboard
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Stato per gestire i modali e le notifiche
    const [modalState, setModalState] = useState({ isOpen: false, title: '', children: null, onConfirm: () => {} });
    const [successState, setSuccessState] = useState({ isVisible: false, title: '', children: null });

    // --- FUNZIONI HELPER ---

    // Funzione per mostrare il messaggio di successo e nasconderlo dopo 3 secondi
    const showSuccessMessage = (title, children) => {
        setSuccessState({ isVisible: true, title, children });
        setTimeout(() => {
            setSuccessState({ isVisible: false, title: '', children: null });
        }, 1000);
    };
    
    // Funzione per chiudere il modale di conferma
    const closeModal = () => {
        setModalState({ isOpen: false, title: '', children: null, onConfirm: () => {} });
    };

    // --- LOGICA DI FETCHING DEI DATI ---
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/dashboard/agent');
            setDashboardData(response.data);
        } catch (err) {
            setError('Failed to fetch dashboard data. Please try again later.');
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);


    // --- GESTIONE AZIONI UTENTE ---

    // 4. Apre il modale per confermare il cambio di stato
    const openToggleConfirmation = (e, propertyId, currentState) => {
        e.preventDefault();
        e.stopPropagation();

        const isOccupied = currentState.toLowerCase() === 'occupied';
        const newState = isOccupied ? 'AVAILABLE' : 'OCCUPIED';
        const title = isOccupied ? "Make Property Available" : "Mark Property as Occupied";
        const message = `Are you sure you want to change the property status to ${newState}?`;

        setModalState({
            isOpen: true,
            title,
            children: <p>{message}</p>,
            onConfirm: () => executeToggleState(propertyId, newState), // La logica vera e propria è qui
        });
    };

    // Logica effettiva che viene eseguita alla conferma
    const executeToggleState = async (propertyId, newState) => {
        try {
            await updatePropertyState(propertyId, newState);
            
            setDashboardData(prevData => ({
                ...prevData,
                properties: prevData.properties.map(p =>
                    p.idProperty === propertyId ? { ...p, propertyState: newState } : p
                )
            }));
            
            showSuccessMessage("Update Successful!", `Property status has been set to ${newState}.`);
        } catch (err) {
            console.error(`Failed to update property state:`, err);
            // Qui potresti mostrare un modale di errore
        } finally {
            closeModal();
        }
    };

    // 5. Apre il modale per confermare la cancellazione
    const openDeleteConfirmation = (e, propertyId) => {
        e.preventDefault();
        e.stopPropagation();

        setModalState({
            isOpen: true,
            title: "Confirm Deletion",
            children: <p>Are you sure you want to delete this property? This action cannot be undone.</p>,
            onConfirm: () => executeDelete(propertyId), // La logica vera e propria è qui
        });
    };

    // Logica effettiva che viene eseguita alla conferma
    const executeDelete = async (propertyId) => {
        try {
            await deleteProperty(propertyId);
            
            setDashboardData(prevData => ({
                ...prevData,
                properties: prevData.properties.filter(p => p.idProperty !== propertyId)
            }));

            showSuccessMessage("Deletion Successful!", "The property has been permanently removed.");
        } catch (err) {
            console.error("Failed to delete property:", err);
            // Qui potresti mostrare un modale di errore
        } finally {
            closeModal();
        }
    };

    // --- GESTIONE EXPORT (invariata) ---
    const handleExportPDF = useCallback(() => {
        if (!dashboardData || !dashboardData.properties) return;
        const doc = new jsPDF();
        doc.text("Agent Property Report", 14, 20);
        autoTable(doc, {
            startY: 30,
            head: [['ID', 'Address', 'Views', 'Visits', 'Offers', 'Status', 'Sale Type']],
            body: dashboardData.properties.map(p => [ p.idProperty, p.fullAddress, p.viewCount, p.bookedVisitsCount, p.offersCount, p.propertyState, p.saleType ]),
        });
        doc.save('property_report.pdf');
    }, [dashboardData]);

    const csvHeaders = [
        { label: "Property ID", key: "idProperty" },
        { label: "Address", key: "fullAddress" },
        { label: "Views", key: "viewCount" },
        { label: "Booked Visits", key: "bookedVisitsCount" },
        { label: "Offers Received", key: "offersCount" },
        { label: "Status", key: "propertyState" },
        { label: "Sale Type", key: "saleType" },
    ];

    // --- RENDER ---
    if (loading) return <div className="dashboard-view"><h2>Loading Dashboard...</h2></div>;
    if (error) return <div className="dashboard-view"><h2 className="error-message">{error}</h2></div>;
    if (!dashboardData) return <div className="dashboard-view"><h2>No data available.</h2></div>;

    return (
        <div className="dashboard-view agent-dashboard">
            {/* 6. Renderizza i componenti customizzati qui */}
            <ConfirmationModal 
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onConfirm={modalState.onConfirm}
                title={modalState.title}
            >
                {modalState.children}
            </ConfirmationModal>

            {successState.isVisible && (
                <SuccessView title={successState.title}>
                    <p>{successState.children}</p>
                </SuccessView>
            )}

            <h2>Agent Dashboard</h2>
            <hr/>
            <div className="stats-grid">
                <StatCard icon={<FaEye />} title="Total Property Views" value={(dashboardData.totalViews ?? 0).toLocaleString()} />
                <StatCard icon={<FaCalendarCheck />} title="Total Booked Visits" value={(dashboardData.bookedVisits ?? 0).toLocaleString()} />
                <StatCard icon={<FaFileSignature />} title="Total Offers Received" value={(dashboardData.offersReceived ?? 0).toLocaleString()} />
                <StatCard icon={<FaBuilding />} title="Active Listings" value={(dashboardData.activeListings ?? 0).toLocaleString()} />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Your Properties Overview</h3>
                    <div className="export-actions">
                        <button onClick={handleExportPDF} className="btn-export">Export PDF</button>
                        {dashboardData.properties &&
                            <CSVLink data={dashboardData.properties} headers={csvHeaders} filename={"property_report.csv"} className="btn-export">
                                Export CSV
                            </CSVLink>
                        }
                    </div>
                </div>

                <div className="property-overview-grid">
                    {dashboardData.properties && dashboardData.properties.length > 0 ? (
                        dashboardData.properties.map(prop => (
                            <div key={prop.idProperty} className="property-overview-card">
                                <Link to={`/property/${prop.idProperty}`} className="card-main-link">
                                    <div className="card-image-container">
                                        <img src={prop.mainImageUrl || placeholderImage} alt={prop.fullAddress} />
                                        <div className="card-badges">
                                            <span className={`status-badge status-${prop.propertyState.toLowerCase()}`}>{prop.propertyState}</span>
                                            <span className={`status-badge status-${prop.saleType.toLowerCase()}`}>{prop.saleType}</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3>{prop.fullAddress}</h3>
                                        <p className="price">€{new Intl.NumberFormat('it-IT').format(prop.price)}</p>
                                        <div className="card-stats">
                                            <div className="stat-item"><FaEye /> <span>{prop.viewCount}</span></div>
                                            <div className="stat-item"><FaCalendarCheck /> <span>{prop.bookedVisitsCount}</span></div>
                                            <div className="stat-item"><FaFileSignature /> <span>{prop.offersCount}</span></div>
                                        </div>
                                    </div>
                                </Link>
                                
                                <div className="card-actions">
                                    {prop.propertyState.toLowerCase() === 'occupied' ? (
                                        <button
                                            onClick={(e) => openToggleConfirmation(e, prop.idProperty, prop.propertyState)}
                                            className="btn-action btn-available"
                                        >
                                            <FaUndo /> Set as Available
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => openToggleConfirmation(e, prop.idProperty, prop.propertyState)} 
                                            className="btn-action btn-sold"
                                        >
                                            <FaCheckCircle /> Set as Occupied
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={(e) => openDeleteConfirmation(e, prop.idProperty)} 
                                        className="btn-action btn-delete"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>You have no active properties.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;