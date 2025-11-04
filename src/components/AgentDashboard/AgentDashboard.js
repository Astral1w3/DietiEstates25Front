import React, { useState, useEffect, useCallback } from 'react';
// 1. IMPORT CORRETTO: Usa la tua istanza axios pre-configurata
//    Assicurati che il percorso sia corretto rispetto alla posizione di questo file.
import api from '../../services/api'; 

// Import per i grafici
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// Import per l'esportazione
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Import per le icone
import { FaEye, FaHandshake, FaFileSignature, FaBuilding } from 'react-icons/fa';

import StatCard from '../StatCard/StatCard';
import './AgentDashboard.css';

// Registra i componenti necessari per Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AgentDashboard = () => {
    // ---- STATO PER DATI REALI, CARICAMENTO ED ERRORI ----
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---- FETCH DEI DATI DAL BACKEND ----
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 2. CHIAMATA SEMPLIFICATA:
                // - L'URL base ('http://localhost:8080/api') è già in 'api'.
                // - L'header 'Authorization' con il token viene aggiunto dall'interceptor.
                //   Non c'è più bisogno di leggerlo manualmente da localStorage qui.
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
    }, []); // L'array vuoto esegue l'effetto solo al montaggio del componente

    // ---- LOGICA PER L'ESPORTAZIONE (invariata, ma ora più robusta) ----
    const handleExportPDF = useCallback(() => {
        if (!dashboardData || !dashboardData.properties) return;
        const doc = new jsPDF();
        doc.text("Agent Property Report", 14, 20);
        doc.autoTable({
            startY: 30,
            head: [['ID', 'Address', 'Views', 'Visits', 'Sale Type', 'Status']],
            body: dashboardData.properties.map(p => [
                p.idProperty,
                `${p.address.street}, ${p.address.city}`,
                p.propertyStats?.numberOfViews || 0,
                p.propertyStats?.numberOfScheduledVisits || 0,
                p.saleType || 'N/A', // Usiamo saleType dal DTO
                'Active' // Placeholder
            ]),
        });
        doc.save('property_report.pdf');
    }, [dashboardData]);

    const csvHeaders = [
        { label: "Property ID", key: "idProperty" },
        { label: "Address", key: "address.street" },
        { label: "City", key: "address.city"},
        { label: "Views", key: "propertyStats.numberOfViews" },
        { label: "Booked Visits", key: "propertyStats.numberOfScheduledVisits" },
        { label: "Sale Type", key: "saleType"},
    ];

    // ---- GESTIONE DEGLI STATI DI CARICAMENTO ED ERRORE (invariato) ----
    if (loading) {
        return <div className="dashboard-loading"><h2>Loading Dashboard...</h2></div>;
    }

    if (error) {
        return <div className="dashboard-error"><h2>{error}</h2></div>;
    }

      // --- NUOVO CONTROLLO DI SICUREZZA ---
    // Se il caricamento è terminato e non ci sono errori, ma i dati non sono ancora arrivati
    // o sono nulli, non tentare di renderizzare il resto del componente.
    if (!dashboardData) {
        return <div className="dashboard-nodata"><h2>No data available.</h2></div>;
    }

    // ---- Se arriviamo qui, siamo sicuri che 'dashboardData' è un oggetto valido ----

    const chartOptions = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Performance Over Last 6 Months' } } };
    const chartData = {
        // Aggiungiamo un controllo anche qui per massima sicurezza
        labels: dashboardData.salesOverTime ? Object.keys(dashboardData.salesOverTime) : [],
        datasets: [{
            label: 'Properties Sold/Rented',
            data: dashboardData.salesOverTime ? Object.values(dashboardData.salesOverTime) : [],
            borderColor: 'rgb(226, 71, 71)',
            backgroundColor: 'rgba(226, 71, 71, 0.5)',
        }],
    };

    console.log(dashboardData)
   return (
        <div className="agent-dashboard">
            <h2>Agent Dashboard</h2>
            <hr/>
            <div className="dashboard-grid stats-grid">
                {/* --- CORREZIONE APPLICATA QUI --- */}
                {/* Usa (valore ?? 0) per fornire un fallback sicuro prima di chiamare toLocaleString() */}
                <StatCard icon={<FaEye />} title="Total Property Views" value={(dashboardData.totalViews ?? 0).toLocaleString()} />
                <StatCard icon={<FaHandshake />} title="Booked Visits" value={(dashboardData.bookedVisits ?? 0).toLocaleString()} />
                <StatCard icon={<FaFileSignature />} title="Offers Received" value={(dashboardData.offersReceived ?? 0).toLocaleString()} />
                <StatCard icon={<FaBuilding />} title="Active Listings" value={(dashboardData.activeListings ?? 0).toLocaleString()} />
            </div>
            
            <div className="card chart-container">
                <h3>Performance Over Time</h3>
                {/* Aggiungi un controllo per evitare di renderizzare il grafico se mancano i dati */}
                {dashboardData.salesOverTime && <Line options={chartOptions} data={chartData} />}
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Properties Overview</h3>
                    <div className="export-actions">
                        <button onClick={handleExportPDF} className="btn-export">Export PDF</button>
                        {dashboardData.properties &&
                            <CSVLink data={dashboardData.properties} headers={csvHeaders} filename={"property_report.csv"} className="btn-export">
                                Export CSV
                            </CSVLink>
                        }
                    </div>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Views</th>
                                <th>Visits</th>
                                <th>Sale Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData && dashboardData.properties.map(prop => (
                                <tr key={prop.idProperty}>
                                    <td>{`${prop.address.street}, ${prop.address.city}, ${prop.address.postalCode}`}</td>
                                    <td>{(prop.propertyStats?.numberOfViews || 0).toLocaleString()}</td>
                                    <td>{prop.propertyStats?.numberOfScheduledVisits || 0}</td>
                                    <td><span className={`status ${prop.saleType?.toLowerCase()}`}>{prop.saleType}</span></td>
                                    <td><span className={`status active`}>Active</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;