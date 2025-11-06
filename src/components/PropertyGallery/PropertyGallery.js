import React, { useState, useEffect } from 'react';
import SlideshowModal from '../SlideshowModal/SlideshowModal';
import './PropertyGallery.css';

const PropertyGallery = ({ images }) => {
    // --- STATO MODIFICATO ---
    // Rimosso lo stato 'mainImage' perché non è più necessario. La galleria è fissa.
    const [isSlideshowOpen, setSlideshowOpen] = useState(false);
    const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);

    // Rimosso l'useEffect che impostava mainImage.

    // Funzione per aprire lo slideshow (invariata, funziona già perfettamente)
    const openSlideshow = (index) => {
        setSlideshowStartIndex(index);
        setSlideshowOpen(true);
    };

    // Controllo iniziale (invariato)
    if (!images || images.length === 0) {
        return null;
    }

    // Rimosso il calcolo di mainImageIndex.

    return (
        <>
            <div className="gallery-container">
                {/* Immagine Principale: ora usa sempre l'indice 0 */}
                <div className="gallery-main-image" onClick={() => openSlideshow(0)}>
                    <img src={images[0]} alt="Main property view" />
                </div>

                {/* Griglia di Immagini Secondarie: logica di click semplificata */}
                <div className="gallery-thumbnails">
                    {images.slice(1, 5).map((image, index) => (
                        <div 
                            key={index} 
                            className="gallery-thumbnail"
                            // MODIFICATO: Al singolo click, apri lo slideshow.
                            // L'indice corretto è (index + 1) perché abbiamo saltato la prima immagine con .slice(1, 5)
                            onClick={() => openSlideshow(index + 1)}
                            // RIMOSSO: onDoubleClick non è più necessario.
                        >
                            <img src={image} alt={`Property view ${index + 2}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modale dello slideshow (invariato) */}
            {isSlideshowOpen && (
                <SlideshowModal 
                    images={images} 
                    startIndex={slideshowStartIndex}
                    onClose={() => setSlideshowOpen(false)} 
                />
            )}
        </>
    );
};

export default PropertyGallery;