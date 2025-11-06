import React, { useState, useMemo, useEffect } from 'react'; // Aggiungi useEffect
import { Link } from 'react-router-dom'; 
import { FaCalendarAlt } from 'react-icons/fa';

// 1. IMPORTA IL NUOVO SERVIZIO
import { getMyBookings } from '../../services/visitService'; // Adatta il percorso se necessario

import StatCard from '../StatCard/StatCard';
import './BookingsView.css';

const BookingsView = () => {
    // 3. AGGIUNGI STATI PER DATI, CARICAMENTO ED ERRORI
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [filter, setFilter] = useState('All');

    // 4. USA useEffect PER CARICARE I DATI DAL BACKEND
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const data = await getMyBookings();
                setBookings(data);
                setError(null);
            } catch (err) {
                setError("Failed to load bookings. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []); // L'array vuoto assicura che venga eseguito solo una volta

    // 5. MODIFICA I CALCOLI PER USARE I DATI REALI
    const filteredBookings = useMemo(() => {
        if (filter === 'All') {
            return bookings;
        }
        // Assicurati che 'b.status' corrisponda al nome del campo restituito dal backend
        return bookings.filter(b => b.status === filter); 
    }, [filter, bookings]); // Aggiungi 'bookings' alle dipendenze

    const totalBookings = bookings.length;
    // const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
    // const pendingCount = bookings.filter(b => b.status === 'Pending').length;

    // 6. GESTISCI GLI STATI DI CARICAMENTO ED ERRORE NEL RENDER
    if (isLoading) {
        return <div className="dashboard-view"><h2>Loading bookings...</h2></div>;
    }

    if (error) {
        return <div className="dashboard-view"><h2 className="error-message">{error}</h2></div>;
    }

    return (
        <div className="dashboard-view">
            <h2>Manage Bookings</h2>
            <hr />

            <div className="stats-grid">
                <StatCard icon={<FaCalendarAlt />} title="Total Bookings" value={totalBookings} />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>All Bookings</h3>
                    {/* Qui potresti aggiungere i bottoni per il filtro */}
                </div>

                <div className="table-container">
                    {filteredBookings.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Client</th>
                                    <th>Visit Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(booking => (
                                    // 7. ASSICURATI CHE I NOMI DEI CAMPI CORRISPONDANO ALL'API
                                    <tr key={booking.id_booking}> 
                                        <td>
                                            <Link to={`/property/${booking.id_property}`} className="property-link">
                                                {booking.propertyAddress}
                                            </Link>
                                        </td>
                                        <td className="client-info">
                                            <div>{booking.clientName}</div>
                                            <small>{booking.email}</small>
                                        </td>
                                        <td>{new Date(booking.visit_date).toLocaleString('it-IT', { dateStyle: 'short' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No bookings found for the selected filter.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingsView;