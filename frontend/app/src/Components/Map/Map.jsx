import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import FormWrapper from '../Form/Form';

const STYLE = {
    OUTDOOR: 'outdoor',
    STREETS_DARK: 'streets-dark',
    STREETS: 'streets',
    WINTER: 'winter',
    SATELLITE: 'satellite',
};

const Map = ({ apiKey, coords = [] }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [style, setStyle] = useState(STYLE.OUTDOOR);
    const [selectedPin, setSelectedPin] = useState(null);
    const sectionRefs = useRef([]);
    const [isModalOpen, setIsModalOpen] = useState(false);  

    const initialCenter = [-84.063429, 39.782072];

    useEffect(() => {
        if (map.current) return; 

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`,
            center: initialCenter,
            zoom: 17,
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }, [apiKey, style]);

    useEffect(() => {
        if (map.current && coords.length > 0) {
            coords.forEach((coord, index) => {
                const marker = new maplibregl.Marker()
                    .setLngLat(coord)
                    .addTo(map.current);

                marker.getElement().addEventListener('click', () => {
                    setSelectedPin(index);
                    sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
                });
            });
        }
    }, [coords]);

    useEffect(() => {
        if (map.current) {
            map.current.setStyle(`https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`);
        }
    }, [style]);

    const handleStyleChange = (e) => {
        setStyle(e.target.value);
    };

    const handleModalToggle = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); 
    };

    return (
        <>
            <div style={{ display: 'flex', width: '100%', height: '400px', position: 'relative' }}>
                <div style={{ width: '70%', height: '100%' }}>
                    <select value={style} onChange={handleStyleChange} style={{ position: 'absolute', zIndex: 10, top: '10px', left: '10px' }}>
                        {Object.values(STYLE).map((style) => (
                            <option key={style} value={style}>
                                {style}
                            </option>
                        ))}
                    </select>
                    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
                </div>

                <div style={{ width: '30%', padding: '10px', overflowY: 'auto', height: '100%' }}>
                    {coords.map((coord, index) => (
                        <div
                            key={index}
                            ref={(el) => (sectionRefs.current[index] = el)} 
                            style={{
                                marginBottom: '20px',
                                padding: '10px',
                                border: '1px solid #ddd',
                                backgroundColor: selectedPin === index ? '#f0f0f0' : 'white',
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <h3>Pin {index + 1}</h3>
                            <p>Coordinates: {coord[0]}, {coord[1]}</p>
                            <p>Unique info for Pin {index + 1} here</p>
                        </div>
                    ))}

                    {/* BIG ASS PLUS BUTTON */}
                    <button 
                        onClick={handleModalToggle} 
                        style={{
                            width: '100%',
                            height: '50px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            fontSize: '16px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        BIG ASS PLUS BUTTON
                    </button>
                </div>
            </div>

            {/* modal stuff */}
            {isModalOpen && (
                <div style={modalBackdropStyle}>
                    <div style={modalContentStyle}>
                        <button 
                            onClick={handleCloseModal} 
                            style={{
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px', 
                                background: 'transparent', 
                                border: 'none', 
                                fontSize: '20px',
                                cursor: 'pointer',
                            }}
                        >
                            &times;
                        </button>
                        <FormWrapper />
                    </div>
                </div>
            )}
        </>
    );
};
 // bad styles
const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    width: '400px',
    maxWidth: '90%',
};

export default Map;
