import React, { useState, useEffect } from 'react';
import SlideshowModal from '../SlideshowModal/SlideshowModal';
import './PropertyGallery.css';

const PropertyGallery = ({ images }) => {
    const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : null);
    const [isSlideshowOpen, setSlideshowOpen] = useState(false);
    
    // Stato per memorizzare l'indice dell'immagine da cui iniziare lo slideshow
    const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImage(images[0]);
        }
    }, [images]);

    // Funzione per aprire lo slideshow
    const openSlideshow = (index) => {
        setSlideshowStartIndex(index);
        setSlideshowOpen(true);
    };

    if (!images || images.length === 0) {
        return null;
    }

    // Trova l'indice dell'immagine principale corrente
    const mainImageIndex = images.indexOf(mainImage);

    return (
        <>
            <div className="gallery-container">
                {/* Immagine Principale: ora è cliccabile */}
                <div className="gallery-main-image" onClick={() => openSlideshow(mainImageIndex)}>
                    <img src={images[mainImageIndex]} alt="Main property view" />
                </div>

                {/* Griglia di Immagini Secondarie */}
                <div className="gallery-thumbnails">
                    {images.slice(1, 5).map((image, index) => (
                        <div 
                            key={index} 
                            className="gallery-thumbnail"
                            // Al click, aggiorna l'immagine principale
                            onClick={() => setMainImage(image)}
                            // Al doppio click, apri lo slideshow da questa immagine
                            onDoubleClick={() => openSlideshow(index + 1)}
                        >
                            <img src={image} alt={`Property view ${index + 2}`} />
                        </div>
                    ))}
                </div>
            </div>

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