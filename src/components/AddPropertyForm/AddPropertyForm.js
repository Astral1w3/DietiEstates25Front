import React, { useState, useRef } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa'; // Icone per l'upload e la rimozione
import './AddPropertyForm.css'; // Creeremo questo file CSS

// Lista statica dei servizi per non ripeterla nel componente
const availableServices = [
    { id: 'concierge', label: 'Concierge', emoji: '🛎️' },
    { id: 'air conditioning', label: 'Air Conditioning', emoji: '❄️' },
    { id: 'close to schools', label: 'Schools Nearby', emoji: '🏫' },
    { id: 'close to parks', label: 'Parks Nearby', emoji: '🌳' },
    { id: 'close to public transport', label: 'Public Transport', emoji: '🚇' },
    { id: 'elevator', label: 'Elevator', emoji: '🛗' },
    { id: 'heating', label: 'Heating', emoji: '🔥' },
    { id: 'garage', label: 'Garage', emoji: '🚗' },
    { id: 'Cellar', label: 'Cellar', emoji: '🍷' },
    { id: 'balcony', label: 'Balcony', emoji: '🌇' },
    { id: 'terrace', label: 'Terrace', emoji: '🪴' },
];

const AddPropertyForm = () => {
    // ---- STATE MANAGEMENT ----
    const [propertyType, setPropertyType] = useState('rent'); // 'rent' or 'sale'
    const [formData, setFormData] = useState({
        price: '', description: '', sqMeters: '', rooms: '', address: '', energyClass: 'A'
    });
    //creo un array di booleani dinamico (se aggiungessi un nuovo servizio l'array avrebbe la lunghezza del numero dei servizi)
    //e setto tutto a false.
    const [services, setServices] = useState(
        availableServices.reduce((acc, service) => ({ ...acc, [service.id]: false }), {})
    );
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    //nei browser non e' possbile modificare esteticamente l'elemento <input type="file"> per ragioni di sicurezza.
    //per aggirare questo problema utilizziamo un useRef che crea una scatola vuota. 
    //all'interno di questa scatola inseriamo <input type="file">. fileInputRef ha una proprieta': fileInputRef.current
    //dove memorizziamo il nostro riferimento. useRef mantiene il proprio valore anche quando avviene il rendering del component
    const fileInputRef = useRef(null); // Riferimento per triggerare l'input file

    // ---- HANDLERS ----
    // "generic input handler"
    const handleInputChange = (e) => {
        //estraiamo nome dell'input del form che ha scatenato l'evento e valore es: (indirizzo, via giacomo)
        const { name, value } = e.target;
        //serve per cambiare le proprieta' in modo dinamico
        //[name] = "Il nome di questa proprietà non è 'name', ma il valore contenuto nella variabile name".
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (e) => {
        const { name, checked } = e.target;
        setServices(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e) => {
        //e.target.files non e' un array ma un oggetto simile ad un array che pero' non ha molti metodi come la traverse.'
        //quindi creiamo un array files per comodita'
        const files = Array.from(e.target.files);
        if (images.length + files.length > 7) {
            setMessage({ text: 'You can upload a maximum of 7 images.', type: 'error' });
            return;
        }

        setImages(prev => [...prev, ...files]);
    };

    //questo indice viene passato dal onClick del pulsante di rimozione nell'anteprima dell'immagine.
    const handleRemoveImage = (indexToRemove) => {
        //Questa espressione confronta l'indice dell'elemento corrente (index) 
        //con l'indice dell'elemento che vogliamo rimuovere (indexToRemove).
        setImages(prev => prev.filter((img, index) => index !== indexToRemove));
    };

    const resetForm = () => {
        setPropertyType('rent');
        setFormData({
            price: '', description: '', sqMeters: '', rooms: '', address: '', energyClass: 'A'
        });
        setServices(
            availableServices.reduce((acc, service) => ({ ...acc, [service.id]: false }), {})
        );
        setImages([]);
        // Resetta anche l'input file nel caso l'utente volesse caricare lo stesso file di nuovo
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    //la funzione e' asincrona perche' diamo alla chiamata il tempo di eseguire in backend per dare un riscontro veritiero
    const handleSubmit = async (e) => {
        //per evitare il refresh del browser quando inviamo i dati
        e.preventDefault();
        //se c'e' stato un error, resetta il messaggio di error nel caso in cui ci dovesse essere un nuovo error
        setMessage({ text: '', type: '' });
        
        // Validazione
        if (!formData.price || !formData.address || !formData.description || !formData.sqMeters || !formData.rooms
        ) {
            setMessage({ text: 'Please fill in all required fields.', type: 'error' });
            return;
        }
        setIsLoading(true);

        // Simulazione API
        console.log("Submitting Data:", { propertyType, ...formData, services, images });
        setTimeout(() => {
            setMessage({ text: 'Property listed successfully!', type: 'success' });
            setIsLoading(false);
            resetForm();
        }, 2000);
    };


    return (
        <div className="card">
            <h2>Add New Property</h2>
            <hr />
            <form onSubmit={handleSubmit} noValidate>
                {/* --- Tipo di Proprietà --- */}
                <div className="form-group">
                    <label>Listing Type</label>
                    <div className="type-selector">
                        <input type="radio" id="rent" name="propertyType" value="rent" checked={propertyType === 'rent'} onChange={() => setPropertyType('rent')} />
                        <label htmlFor="rent">For Rent</label>
                        <input type="radio" id="sale" name="propertyType" value="sale" checked={propertyType === 'sale'} onChange={() => setPropertyType('sale')} />
                        <label htmlFor="sale">For Sale</label>
                    </div>
                </div>

                {/* --- Input Standard --- */}
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="price">{propertyType === 'rent' ? 'Monthly Price (€)' : 'Total Price (€)'}</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sqMeters">Square Meters (m²)</label>
                        <input type="number" id="sqMeters" name="sqMeters" value={formData.sqMeters} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rooms">Number of Rooms</label>
                        <input type="number" id="rooms" name="rooms" value={formData.rooms} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="energyClass">Energy Class</label>
                        <select id="energyClass" name="energyClass" value={formData.energyClass} onChange={handleInputChange}>
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-group full-width">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleInputChange} required></textarea>
                </div>

                {/* --- Servizi --- */}
                <div className="form-group full-width">
                    <label className="group-legend">Services</label>
                    <div className="checkbox-group">
                        {availableServices.map(service => (
                            <div key={service.id} className="checkbox">
                                <label className="checkbox-wrapper">
                                    <input 
                                        type="checkbox" 
                                        className="checkbox-input"
                                        name={service.id}
                                        checked={services[service.id]}
                                        onChange={handleServiceChange}
                                    />
                                    <span className="checkbox-tile">
                                        <span className="checkbox-icon">{service.emoji}</span>
                                        <span className="checkbox-label">{service.label}</span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Upload Immagini --- */}
                <div className="form-group full-width">
                    <label>Images (Max 7)</label>
                    <input 
                        type="file" 
                        multiple accept="image/*"
                        ref={fileInputRef}             //qui colleghiamo il fileInputRef a <input type="file"> 
                        onChange={handleImageChange}  //fileInputRef.current ora contiene l'input HTML vero e proprio.
                        style={{ display: 'none' }} />
                    <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}
                    //onClick serve per utilizzare fileInputRef.current che sarebbe <input type="file"> 
                    >  
                        <FaUpload /> Select Images
                    </button>
                    <div className="image-preview-grid">
                        {images.map((image, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={URL.createObjectURL(image)} alt={`preview ${index}`} />
                                <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(index)}><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
                
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'List Property'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPropertyForm;