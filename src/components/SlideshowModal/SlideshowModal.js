// src/components/SlideshowModal/SlideshowModal.js

import React, { useState, useEffect, useCallback } from 'react';
import './SlideshowModal.css';

const SlideshowModal = ({ images, onClose }) => {
    // Stato per tenere traccia dell'indice dell'immagine corrente
    const [currentIndex, setCurrentIndex] = useState(0);

    // Funzione per andare all'immagine successiva (con logica ciclica)
    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);

    // Funzione per andare all'immagine precedente (con logica ciclica)
    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);

    // Bonus: Aggiungi la navigazione con le frecce della tastiera e la chiusura con ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                goToNext();
            } else if (event.key === 'ArrowLeft') {
                goToPrevious();
            } else if (event.key === 'Escape') {
                onClose();
            }
        };

        // Aggiungi l'event listener quando il componente si monta
        window.addEventListener('keydown', handleKeyDown);

        // Rimuovi l'event listener quando il componente si smonta per evitare memory leak
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goToNext, goToPrevious, onClose]);


    return (
        // L'overlay opaco che copre tutta la pagina
        <div className="slideshow-modal-overlay" onClick={onClose}>
            {/* Contenitore principale dello slideshow (impedisce la chiusura al click) */}
            <div className="slideshow-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Pulsante per chiudere il modal */}
                <button className="slideshow-close-btn" onClick={onClose}>×</button>

                {/* Pulsante di navigazione: Precedente */}
                <button className="slideshow-nav-btn prev" onClick={goToPrevious}>‹</button>
                
                {/* Immagine visualizzata */}
                <img 
                    src={images[currentIndex]} 
                    alt={`Property view ${currentIndex + 1}`} 
                    className="slideshow-image"
                />

                {/* Pulsante di navigazione: Successivo */}
                <button className="slideshow-nav-btn next" onClick={goToNext}>›</button>

                {/* Contatore immagini */}
                <div className="slideshow-counter">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default SlideshowModal;