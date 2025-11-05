// in src/components/ConfirmationModal/ConfirmationModal.js

import React from 'react';
import './ConfirmationModal.css'; // Creeremo questo file per lo stile

const ConfirmationModal = ({
    isOpen,         // Booleano per mostrare/nascondere il modale
    onClose,        // Funzione da chiamare per chiudere (es. cliccando 'Annulla')
    onConfirm,      // Funzione da chiamare quando si clicca 'OK'
    title,          // Titolo del modale (es. "Conferma Azione")
    children        // Contenuto del modale (es. il testo della domanda)
}) => {
    
    // Se il modale non è aperto, non renderizzare nulla
    if (!isOpen) {
        return null;
    }

    return (
        // L'overlay scuro che copre l'intera pagina
        <div className="modal-overlay" onClick={onClose}>
            {/* Il box del modale. Usiamo stopPropagation per evitare che il clic si propaghi all'overlay e chiuda tutto */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                <h3 className="modal-title">{title}</h3>
                
                <div className="modal-body">
                    {children}
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={onConfirm}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;