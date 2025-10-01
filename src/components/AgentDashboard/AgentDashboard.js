import React, { useCallback } from 'react';
// Import per i grafici
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// Import per l'esportazione
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
// Import per le icone
import { FaEye, FaHandshake, FaFileSignature, FaBuilding } from 'react-icons/fa';

import StatCard from '../StatCard/StatCard'; // Il nostro componente riutilizzabile
import './AgentDashboard.css'; // Creeremo questo file

// Registra i componenti necessari per Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- DATI DI ESEMPIO ---
const mockData = {
    totalViews: 12543,
    bookedVisits: 187,
    offersReceived: 42,
    properties: [
        { id: 'P001', address: '123 Main St', views: 4500, visits: 60, offers: 15, status: 'Active' },
        { id: 'P002', address: '456 Oak Ave', views: 3200, visits: 45, offers: 10, status: 'Active' },
        { id: 'P003', address: '789 Pine Ln', views: 1800, visits: 30, offers: 8, status: 'Sold' },
        { id: 'P004', address: '101 Maple Dr', views: 3043, visits: 52, offers: 9, status: 'Active' },
    ],
    salesOverTime: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        data: [2, 3, 5, 4, 7, 6],
    }
};

const AgentDashboard = () => {
    // ---- LOGICA PER L'ESPORTAZIONE ----
    const handleExportPDF = useCallback(() => {
        const doc = new jsPDF();
        doc.text("Agent Property Report", 14, 20);
        autoTable(doc, {
            startY: 30,
            head: [['ID', 'Address', 'Views', 'Visits', 'Offers', 'Status']],
            body: mockData.properties.map(p => [p.id, p.address, p.views, p.visits, p.offers, p.status]),
        });
        doc.save('property_report.pdf');
    }, []);

    const csvHeaders = [
        { label: "Property ID", key: "id" },
        { label: "Address", key: "address" },
        { label: "Views", key: "views" },
        { label: "Booked Visits", key: "visits" },
        { label: "Offers Received", key: "offers" },
        { label: "Status", key: "status" },
    ];

    // ---- CONFIGURAZIONE DEL GRAFICO ----
    const chartOptions = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Properties Sold/Rented Per Month' } } };
    const chartData = {
        labels: mockData.salesOverTime.labels,
        datasets: [{
            label: 'Properties',
            data: mockData.salesOverTime.data,
            borderColor: 'rgb(226, 71, 71)',
            backgroundColor: 'rgba(226, 71, 71, 0.5)',
        }],
    };

    return (
        <div className="agent-dashboard">
            <h2>Agent Dashboard</h2>
            <hr/>
            <div className="dashboard-grid">
                <StatCard icon={<FaEye />} title="Total Property Views" value={mockData.totalViews.toLocaleString()} change="+5% this month" />
                <StatCard icon={<FaHandshake />} title="Booked Visits" value={mockData.bookedVisits} change="+12 bookings" />
                <StatCard icon={<FaFileSignature />} title="Offers Received" value={mockData.offersReceived} change="+3 new offers" />
                <StatCard icon={<FaBuilding />} title="Active Listings" value={mockData.properties.filter(p => p.status === 'Active').length} />
            </div>

            <div className="card chart-container">
                <h3>Performance Over Time</h3>
                <Line options={chartOptions} data={chartData} />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Properties Overview</h3>
                    <div className="export-actions">
                        <button onClick={handleExportPDF} className="btn-export">Export PDF</button>
                        <CSVLink data={mockData.properties} headers={csvHeaders} filename={"property_report.csv"} className="btn-export">
                            Export CSV
                        </CSVLink>
                    </div>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Views</th>
                                <th>Visits</th>
                                <th>Offers</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockData.properties.map(prop => (
                                <tr key={prop.id}>
                                    <td>{prop.address}</td>
                                    <td>{prop.views.toLocaleString()}</td>
                                    <td>{prop.visits}</td>
                                    <td>{prop.offers}</td>
                                    <td><span className={`status ${prop.status.toLowerCase()}`}>{prop.status}</span></td>
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