import React, { useEffect, useRef } from 'react';
import './FilterDropdown.css';

// Dati di esempio
const roomOptions = [0, 1, 2, 3, 4, 5]; 
const energyClassOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const FilterDropdown = ({ 
    isOpen, 
    onClose, 
    filters, 
    onFilterChange, 
    onApplyFilters, 
    onResetFilters,
    availableServices,
    selectedServices,
    onServiceChange
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="filter-dropdown-container" ref={dropdownRef}>
            <div className="filter-header">
                <h3>Filters</h3>
                <button onClick={onClose} className="close-btn">×</button>
            </div>
        


            <div className="filter-content">

                {/* --- SEZIONE TIPO DI TRANSAZIONE --- */}
            <div className="filter-section">
                <div className="radio-group-container">
                    {/* Opzione Rent */}
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="type-rent"
                            name="transactionType"
                            value="rent"
                            checked={filters.transactionType === 'rent'}
                            onChange={onFilterChange}
                        />
                        <label htmlFor="type-rent">Rent</label>
                    </div>

                    {/* Opzione Buy */}
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="type-buy"
                            name="transactionType"
                            value="buy"
                            checked={filters.transactionType === 'buy'}
                            onChange={onFilterChange}
                        />
                        <label htmlFor="type-buy">Buy</label>
                    </div>

                    {/* Opzione Any */}
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="type-any"
                            name="transactionType"
                            value="any" // o una stringa vuota '' se preferisci
                            checked={filters.transactionType === 'any' || !filters.transactionType}
                            onChange={onFilterChange}
                        />
                        <label htmlFor="type-any">Any</label>
                    </div>
                </div>
            </div>

                {/* --- SEZIONE PREZZO --- */}
                <div className="filter-section">
                    <label>Price (€)</label>
                    <div className="range-inputs">
                        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={onFilterChange} className="filter-input" />
                        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={onFilterChange} className="filter-input" />
                    </div>
                </div>

                {/* --- SEZIONE POSIZIONE --- */}
                <div className="filter-section">
                    <label>Position</label>
                    <input type="text" name="municipality" placeholder="Municipality" value={filters.municipality} onChange={onFilterChange} />
                    <input type="text" name="city" placeholder="City" value={filters.city} onChange={onFilterChange} />
                    <input type="text" name="region" placeholder="Region" value={filters.region} onChange={onFilterChange} />
                </div>
                
                {/* ---- NUOVA SEZIONE INSERITA QUI ---- */}
                <div className="filter-section">
                    <div className="select-inputs">
                        <div className="input-group">
                            <label htmlFor="rooms">Number of rooms</label>
                            <select id="rooms" name="rooms" value={filters.rooms} onChange={onFilterChange} className="filter-select">
                                <option value="">Any</option>
                                {roomOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="energyClass">Energy Class</label>
                            <select id="energyClass" name="energyClass" value={filters.energyClass} onChange={onFilterChange} className="filter-select">
                                <option value="">Any</option>
                                {energyClassOptions.map(option => (
                                    <option key={option} value={option}>{`${option}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SEZIONE SERVIZI --- */}
                <div className="filter-section">
                    <label>Services</label>
                    <div className="services-grid">
                        {availableServices && availableServices.map(service => (
                            <div key={service.id} className="service-item">
                                <input type="checkbox" id={`service-${service.id}`} checked={selectedServices.includes(service.id)} onChange={() => onServiceChange(service.id)} />
                                <label htmlFor={`service-${service.id}`}>
                                    {service.emoji} {service.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="filter-footer">
                <button onClick={onResetFilters} className="btn-reset">Reset</button>
                <button onClick={onApplyFilters} className="btn-apply">Apply Filters</button>
            </div>
        </div>
    );
};

export default FilterDropdown;