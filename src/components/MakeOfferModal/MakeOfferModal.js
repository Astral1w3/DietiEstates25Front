import React, { useState } from 'react';
import { createOffer } from '../../services/offerService'; // Il servizio ora è corretto
import SuccessView from '../SuccessView/SuccessView';
import './MakeOfferModal.css';

const MakeOfferModal = ({ isOpen, onClose, propertyId, currentPrice }) => {
    const [offerPrice, setOfferPrice] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        setOfferPrice('');
        setError('');
        setIsSuccess(false);
        onClose();
    };

    const handleSubmit = async () => {
        const priceValue = parseFloat(offerPrice);

        // La validazione frontend rimane come prima linea di difesa
        if (!priceValue || priceValue <= 0) {
            setError('Inserisci un importo valido.');
            return;
        }
        if (priceValue >= currentPrice) {
            setError(`L'offerta deve essere inferiore al prezzo attuale.`);
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const offerData = {
                propertyId: propertyId,
                offerPrice: priceValue
            };
            
            await createOffer(offerData); // Chiama il servizio corretto
            
            setIsSuccess(true);

            setTimeout(() => {
                handleClose();
            }, 3000);

        } catch (err) {
            // --- GESTIONE DEGLI ERRORI MIGLIORATA ---
            // Controlliamo se l'errore proviene dalla risposta del server (es. errore di validazione 400)
            if (err.response && err.response.data && err.response.data.message) {
                // Mostra all'utente il messaggio di errore specifico inviato dal backend
                setError(err.response.data.message);
            } else {
                // Altrimenti, è un errore di rete o un altro problema imprevisto
                setError("Si è verificato un errore di connessione. Riprova più tardi.");
            }
        } finally {
            // Questa parte viene eseguita sia in caso di successo che di errore
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {isSuccess ? (
                    <SuccessView title="Offerta Inviata!">
                        <p>
                            La tua offerta di{' '}
                            <strong>
                                {parseFloat(offerPrice).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                            </strong>
                            {' '}è stata inviata con successo.
                        </p>
                    </SuccessView>
                ) : (
                    <>
                        <h2>Fai la tua offerta</h2>
                        <p>
                            Prezzo attuale: {currentPrice.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                        </p>
                        
                        <div className="offer-input-group">
                            <label htmlFor="offerPrice">La tua offerta (€)</label>
                            <input
                                type="number"
                                id="offerPrice"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                placeholder="Es. 450000"
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        {error && <p className="modal-error">{error}</p>}
                        
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                                Annulla
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || !offerPrice}
                            >
                                {isSubmitting ? 'Invio...' : 'Invia Offerta'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MakeOfferModal;