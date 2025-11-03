import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configura la tua API Key di Geoapify qui
const GEOAPIFY_API_KEY = "10c85af945f84d199501c9b466918a85"; // Ho visto che l'avevi già, la lascio

// Icona di default (il tuo codice era perfetto)
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

// Icona per l'hover (il tuo codice era perfetto)
const hoveredIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const MapDisplay = ({ properties, hoveredPropertyId }) => {

    // --- CORREZIONE 1: FILTRA LE PROPRIETÀ PER PREVENIRE ERRORI ---
    // Creiamo un nuovo array che contiene solo le proprietà con coordinate valide.
    // Questo è il passaggio fondamentale per evitare il crash "Invalid LatLng".
    const validProperties = properties.filter(p => 
        p.address && 
        typeof p.address.latitude === 'number' && 
        typeof p.address.longitude === 'number'
    );

    // --- CORREZIONE 2: CENTRA LA MAPPA SUI RISULTATI ---
    // Se ci sono risultati, centra la mappa sul primo. Altrimenti, usa un centro di default (es. Roma).
    const mapCenter = validProperties.length > 0
        ? [validProperties[0].address.latitude, validProperties[0].address.longitude]
        : [40.8518, 14.2681]; // Default a Napoli se non ci sono risultati


    // Creiamo una chiave unica basata sui risultati. Se non ci sono risultati,
    // usiamo una chiave di default. Se ci sono, la chiave cambia se cambia
    // la prima proprietà o il numero totale di risultati.
    // Questo forza React a rimontare MapContainer da zero, applicando il nuovo centro.
    const mapKey = validProperties.length > 0
        ? `${validProperties[0].idProperty}-${validProperties.length}`
        : "default-map";


    // Il tuo controllo per l'API Key è ottimo, lo manteniamo
    if (!GEOAPIFY_API_KEY || GEOAPIFY_API_KEY === "LA_TUA_API_KEY_DI_GEOAPIFY") {
        return <div style={{padding: '20px', backgroundColor: '#fff2f2'}}>
            <strong>Attenzione:</strong> Inserisci la tua API Key di Geoapify nel file MapDisplay.js per visualizzare la mappa.
        </div>
    }

    return (
        <MapContainer key={mapKey} center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>  
            <TileLayer
                url={`https://maps.geoapify.com/v1/tile/positron/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
                attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors'
            />

            {/* --- CORREZIONE 3: MAPPA L'ARRAY FILTRATO E USA I CAMPI CORRETTI --- */}
            {validProperties.map(property => {
                console.log(property)
                // Formattiamo l'indirizzo per il popup per evitare l'errore "Objects are not valid"
                const popupAddress = `${property.address.street}, ${property.address.municipality.municipalityName}`;
                const formattedPrice = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(property.price);

                return (
                    <Marker 
                        // Usa 'idProperty' dal backend
                        key={property.idProperty} 
                        // Leggi le coordinate dalla posizione corretta dentro 'address'
                        position={[property.address.latitude, property.address.longitude]}
                        // La tua logica per l'hover è corretta, basta usare 'idProperty'
                        icon={property.idProperty === hoveredPropertyId ? hoveredIcon : defaultIcon}
                    >
                        <Popup>
                            <strong>{formattedPrice}</strong><br/>
                            {popupAddress} {/* Usa la stringa formattata */}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapDisplay;