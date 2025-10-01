import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import 'jspdf-autotable';
import { FaTags, FaRegClock, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import StatCard from '../StatCard/StatCard';
import './OffersView.css';

const mockOffers = [
    { id_offer: 1, id_property: 101, propertyAddress: '123 Main St, Milano', listingPrice: 350000.00, offer_price: 345000.00, offer_date: '2023-11-15T09:30:00', clientName: 'Mario Rossi', clientEmail: 'mario.rossi@example.com', state: 'Pending' },
    { id_offer: 2, id_property: 102, propertyAddress: '456 Oak Ave, Roma', listingPrice: 280000.00, offer_price: 280000.00, offer_date: '2023-11-14T15:00:00', clientName: 'Luigi Verdi', clientEmail: 'luigi.verdi@example.com', state: 'Accepted' },
    { id_offer: 3, id_property: 103, propertyAddress: '789 Pine Ln, Napoli', listingPrice: 190000.00, offer_price: 175000.00, offer_date: '2023-11-12T11:00:00', clientName: 'Anna Bianchi', clientEmail: 'anna.bianchi@example.com', state: 'Rejected' },
    { id_offer: 4, id_property: 101, propertyAddress: '123 Main St, Milano', listingPrice: 350000.00, offer_price: 340000.00, offer_date: '2023-11-16T18:45:00', clientName: 'Laura Neri', clientEmail: 'laura.neri@example.com', state: 'Pending' },
];

const OffersView = () => {
    const [filter, setFilter] = useState('All');

    const filteredOffers = useMemo(() => {
        if (filter === 'All') {
            return mockOffers;
        }
        return mockOffers.filter(o => o.state === filter);
    }, [filter]);

    const totalOffers = mockOffers.length;
    const pendingCount = mockOffers.filter(o => o.state === 'Pending').length;
    const acceptedCount = mockOffers.filter(o => o.state === 'Accepted').length;

    return (
        <div className="dashboard-view">
            <h2>Manage Offers</h2>
            <hr />

            <div className="stats-grid">
                <StatCard icon={<FaTags />} title="Total Offers Received" value={totalOffers} />
                <StatCard icon={<FaRegClock />} title="Pending Review" value={pendingCount} />
                <StatCard icon={<FaRegCheckCircle />} title="Accepted Offers" value={acceptedCount} />
                <StatCard icon={<FaRegTimesCircle />} title="Rejected Offers" value={mockOffers.filter(o => o.state === 'Rejected').length} />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>All Offers</h3>
                    <div className="filter-buttons">
                        <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
                        <button onClick={() => setFilter('Pending')} className={filter === 'Pending' ? 'active' : ''}>Pending</button>
                        <button onClick={() => setFilter('Accepted')} className={filter === 'Accepted' ? 'active' : ''}>Accepted</button>
                        <button onClick={() => setFilter('Rejected')} className={filter === 'Rejected' ? 'active' : ''}>Rejected</button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Client</th>
                                <th>Prices</th>
                                <th>Offer Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOffers.map(offer => (
                                <tr key={offer.id_offer}>
                                    <td>
                                        <Link to={`/properties/${offer.id_property}`} className="property-link">
                                            {offer.propertyAddress}
                                        </Link>
                                    </td>
                                    <td className="client-info">
                                        <div>{offer.clientName}</div>
                                        <small>{offer.clientEmail}</small>
                                    </td>
                                    <td>
                                        <div className="price-comparison">
                                            <span className="listing-price">
                                                €{new Intl.NumberFormat('it-IT').format(offer.listingPrice)}
                                            </span>
                                            <span className="offer-price">
                                                €{new Intl.NumberFormat('it-IT').format(offer.offer_price)}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{new Date(offer.offer_date).toLocaleDateString('it-IT')}</td>
                                    <td>
                                        <span className={`status-badge status-${offer.state.toLowerCase()}`}>
                                            {offer.state}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        {offer.state === 'Pending' && (
                                            <>
                                                <button className="btn-action confirm">Accept</button>
                                                <button className="btn-action reject">Reject</button>
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

export default OffersView;