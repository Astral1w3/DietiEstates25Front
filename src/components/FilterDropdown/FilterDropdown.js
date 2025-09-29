import React, { useEffect, useRef } from 'react';
import './FilterDropdown.css';

// Dati di esempio (priceOptions è stato rimosso)
const roomOptions = [1, 2, 3, 4, 5];
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
                {/* --- SEZIONE PREZZO MODIFICATA --- */}
                <div className="filter-section">
                    <label>Price (€)</label>
                    <div className="range-inputs">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={onFilterChange}
                            className="filter-input"
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={onFilterChange}
                            className="filter-input"
                        />
                    </div>
                </div>

                {/* --- SEZIONI ESISTENTI (invariate) --- */}
                {/* ... le tue sezioni per tipo, stanze, classe energetica, etc. ... */}
                <div className="filter-section">
                    <label>Position</label>
                    <input type="text" name="municipality" placeholder="Municipality" value={filters.municipality} onChange={onFilterChange} />
                    <input type="text" name="city" placeholder="City" value={filters.city} onChange={onFilterChange} />
                    <input type="text" name="region" placeholder="Region" value={filters.region} onChange={onFilterChange} />
                </div>
                
                <div className="filter-section">
                    <label>Services</label>
                    <div className="services-grid">
                        {availableServices && availableServices.map(service => (
                            <div key={service.id} className="service-item">
                                <input
                                    type="checkbox"
                                    id={`service-${service.id}`}
                                    checked={selectedServices.includes(service.id)}
                                    onChange={() => onServiceChange(service.id)}
                                />
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