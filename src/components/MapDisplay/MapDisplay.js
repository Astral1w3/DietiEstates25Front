import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
//L serve per modificare gli oggetti come icone ecc 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configura la tua API Key di Geoapify qui
const GEOAPIFY_API_KEY = "10c85af945f84d199501c9b466918a85";

// Fix per l'icona di default di Leaflet con React
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

// Icona personalizzata per l'immobile evidenziato (hover)
const hoveredIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const MapDisplay = ({ properties, hoveredPropertyId }) => {
    // San Francisco coordinates
    const mapCenter = [37.7749, -122.4194];

    if (!GEOAPIFY_API_KEY || GEOAPIFY_API_KEY === "LA_TUA_API_KEY_DI_GEOAPIFY") {
        return <div style={{padding: '20px', backgroundColor: '#fff2f2'}}>
            <strong>Attenzione:</strong> Inserisci la tua API Key di Geoapify nel file MapDisplay.js per visualizzare la mappa.
        </div>
    }

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url={`https://maps.geoapify.com/v1/tile/positron/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
                attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors'
            />
            {properties.map(property => (
                <Marker 
                    key={property.id} 
                    position={[property.lat, property.lon]}
                    // Scegli l'icona in base all'ID dell'immobile in hover
                    icon={property.id === hoveredPropertyId ? hoveredIcon : defaultIcon}
                >
                    <Popup>
                        <strong>${property.price}/mo</strong><br/>
                        {property.address}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapDisplay;