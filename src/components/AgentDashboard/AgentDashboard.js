import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../../services/api'; 
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { FaEye, FaCalendarCheck, FaFileSignature, FaBuilding } from 'react-icons/fa';

import StatCard from '../StatCard/StatCard';
import './AgentDashboard.css';

// URL di un'immagine placeholder nel caso la proprietà non ne abbia
const placeholderImage = 'https://via.placeholder.com/400x250.png?text=No+Image';

const AgentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/agent');
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again later.');
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleExportPDF = useCallback(() => {
        if (!dashboardData || !dashboardData.properties) return;
        const doc = new jsPDF();
        
        doc.text("Agent Property Report", 14, 20);
        
        autoTable(doc, {
            startY: 30,
            head: [['ID', 'Address', 'Views', 'Visits', 'Offers', 'Status', 'Sale Type']],
            body: dashboardData.properties.map(p => [
                p.idProperty,
                p.fullAddress,
                p.viewCount,
                p.bookedVisitsCount,
                p.offersCount,
                p.propertyState,
                p.saleType
            ]),
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

    if (loading) return <div className="dashboard-view"><h2>Loading Dashboard...</h2></div>;
    if (error) return <div className="dashboard-view"><h2 className="error-message">{error}</h2></div>;
    if (!dashboardData) return <div className="dashboard-view"><h2>No data available.</h2></div>;

    // --- LOGICA DEL GRAFICO RIMOSSA ---
    
    return (
        <div className="dashboard-view agent-dashboard">
            <h2>Agent Dashboard</h2>
            <hr/>
            <div className="stats-grid">
                <StatCard icon={<FaEye />} title="Total Property Views" value={(dashboardData.totalViews ?? 0).toLocaleString()} />
                <StatCard icon={<FaCalendarCheck />} title="Total Booked Visits" value={(dashboardData.bookedVisits ?? 0).toLocaleString()} />
                <StatCard icon={<FaFileSignature />} title="Total Offers Received" value={(dashboardData.offersReceived ?? 0).toLocaleString()} />
                <StatCard icon={<FaBuilding />} title="Active Listings" value={(dashboardData.activeListings ?? 0).toLocaleString()} />
            </div>
            
            {/* --- GRAFICO RIMOSSO DAL JSX --- */}

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
                            <Link to={`/properties/${prop.idProperty}`} key={prop.idProperty} className="property-overview-card">
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
                                        <div className="stat-item">
                                            <FaEye /> <span>{prop.viewCount}</span>
                                        </div>
                                        <div className="stat-item">
                                            <FaCalendarCheck /> <span>{prop.bookedVisitsCount}</span>
                                        </div>
                                        <div className="stat-item">
                                            <FaFileSignature /> <span>{prop.offersCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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