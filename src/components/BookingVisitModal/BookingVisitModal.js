import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
// Importa le nuove funzioni dal service
import { bookVisit, getBookedDates } from '../../services/visitService';
import SuccessView from '../SuccessView/SuccessView';


// CSS
import 'react-datepicker/dist/react-datepicker.css';
import './BookingVisitModal.css';

const BookingVisitModal = ({ isOpen, onClose, propertyId }) => {
    // Stato per la data, errori e sottomissione
    const [selectedDate, setSelectedDate] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    // NUOVO STATO: per le date da disabilitare e il loro caricamento
    const [bookedDates, setBookedDates] = useState([]);
    const [isLoadingDates, setIsLoadingDates] = useState(true);

    // EFFETTO: Carica le date prenotate quando il modale si apre
    useEffect(() => {
        // Esegui solo se il modale è aperto e abbiamo un propertyId
        if (isOpen && propertyId) {
            const fetchBookedDates = async () => {
                setIsLoadingDates(true);
                try {
                    const dates = await getBookedDates(propertyId);
                    setBookedDates(dates);
                } catch (err) {
                    // Se fallisce, mostriamo un errore nel modale
                    setError("Impossibile caricare le date disponibili.");
                } finally {
                    setIsLoadingDates(false);
                }
            };

            fetchBookedDates();
        }
    }, [isOpen, propertyId]); // Dipendenze: riesegui se il modale si apre o cambia immobile

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        setSelectedDate(null);
        setError('');
        onClose();
        setIsSuccess(false);
    };

    const handleSubmit = async () => {
        if (!selectedDate) {
            setError("Per favore, seleziona una data.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await bookVisit({
                propertyId: propertyId,
                // Assicurati di inviare la data in un formato standard (es. ISO)
                visitDate: selectedDate.toISOString(),
            });
            setIsSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2500);
        } catch (err) {
            console.error("Errore durante la prenotazione della visita:", err);
            setError("Si è verificato un errore. Riprova più tardi.");
        } finally {
            setIsSubmitting(false);
        }
    };
 return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {isSuccess ? (
                    // MOLTO PIÙ PULITO: Usiamo il nuovo componente passandogli titolo e messaggio
                    <SuccessView title="Richiesta Inviata!">
                        <p>
                            La tua richiesta di visita per il giorno <br/>
                            <strong>{selectedDate.toLocaleDateString('it-IT')}</strong> è stata inviata. <br/>
                            A presto!
                        </p>
                    </SuccessView>
                ) : (
                    <>
                        <h2>Seleziona una data per la visita</h2>
                        
                        {isLoadingDates ? (
                            <p>Caricamento calendario...</p>
                        ) : (
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    if (error) setError('');
                                }}
                                inline
                                minDate={new Date()}
                                excludeDates={bookedDates.map(date => new Date(date))}
                                locale="it"
                            />
                        )}

                        {error && <p className="modal-error">{error}</p>}

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                                Annulla
                            </button>
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting || !selectedDate || isLoadingDates}>
                                {isSubmitting ? 'Invio...' : 'Invia Richiesta'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingVisitModal;