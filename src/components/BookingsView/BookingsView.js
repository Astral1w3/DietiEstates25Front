import React, { useState, useMemo} from 'react';
import { Link } from 'react-router-dom'; 
import 'jspdf-autotable';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock} from 'react-icons/fa';

import StatCard from '../StatCard/StatCard';
import './BookingsView.css';

const mockBookings = [
    { id_booking: 1, id_property: 101, propertyAddress: '123 Main St', email: 'mario.rossi@example.com', clientName: 'Mario Rossi', visit_date: '2023-10-28T10:00:00', status: 'Confirmed' },
    { id_booking: 2, id_property: 102, propertyAddress: '456 Oak Ave', email: 'luigi.verdi@example.com', clientName: 'Luigi Verdi', visit_date: '2023-10-29T14:30:00', status: 'Completed' },
    { id_booking: 3, id_property: 103, propertyAddress: '789 Pine Ln', email: 'anna.bianchi@example.com', clientName: 'Anna Bianchi', visit_date: '2023-11-02T11:00:00', status: 'Pending' },
    { id_booking: 4, id_property: 104, propertyAddress: '101 Maple Dr', email: 'laura.neri@example.com', clientName: 'Laura Neri', visit_date: '2023-11-05T16:00:00', status: 'Cancelled' },
    { id_booking: 5, id_property: 101, propertyAddress: '123 Main St', email: 'paolo.gialli@example.com', clientName: 'Paolo Gialli', visit_date: '2023-11-10T09:30:00', status: 'Confirmed' },
];

const BookingsView = () => {
    const [filter, setFilter] = useState('All');

    const filteredBookings = useMemo(() => {
        if (filter === 'All') {
            return mockBookings;
        }
        return mockBookings.filter(b => b.status === filter);
    }, [filter]);

    const totalBookings = mockBookings.length;
    const confirmedCount = mockBookings.filter(b => b.status === 'Confirmed').length;
    const pendingCount = mockBookings.filter(b => b.status === 'Pending').length;

    return (
        <div className="dashboard-view">
            <h2>Manage Bookings</h2>
            <hr />

            <div className="stats-grid">
                <StatCard icon={<FaCalendarAlt />} title="Total Bookings" value={totalBookings} />
                <StatCard icon={<FaCheckCircle />} title="Confirmed" value={confirmedCount} change="+2 this week" />
                <StatCard icon={<FaClock />} title="Pending Approval" value={pendingCount} />
                <StatCard icon={<FaTimesCircle />} title="Cancelled" value={mockBookings.filter(b => b.status === 'Cancelled').length} />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>All Bookings</h3>
                    <div className="filter-buttons">
                        <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
                        <button onClick={() => setFilter('Confirmed')} className={filter === 'Confirmed' ? 'active' : ''}>Confirmed</button>
                        <button onClick={() => setFilter('Pending')} className={filter === 'Pending' ? 'active' : ''}>Pending</button>
                        <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Client</th>
                                <th>Visit Date & Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id_booking}>
                                    <td>
                                        <Link to={`/properties/${booking.id_property}`} className="property-link">
                                            {booking.propertyAddress}
                                        </Link>
                                    </td>
                                    <td className="client-info">
                                        <div>{booking.clientName}</div>
                                        <small>{booking.email}</small>
                                    </td>
                                    <td>{new Date(booking.visit_date).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                    <td>
                                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        {booking.status === 'Pending' && (
                                            <>
                                                <button className="btn-action confirm">Confirm</button>
                                                <button className="btn-action reject">Cancel</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingsView;