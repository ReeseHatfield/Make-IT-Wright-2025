import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
import "./Map.css"

const STYLE = {
    OUTDOOR: "outdoor",
    STREETS_DARK: "streets-dark",
    STREETS: "streets",
    WINTER: "winter",
    SATELLITE: "satellite"
};

const Map = ({ apiKey, coords = [] }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [style, setStyle] = useState(STYLE.OUTDOOR);
    const [selectedPin, setSelectedPin] = useState(null);
    const sectionRefs = useRef([]);

    const initialCenter = [-84.063429, 39.782072];

    useEffect(() => {
        if (map.current) return; // Only initialize once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`,
            center: initialCenter,
            zoom: 17,
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }, [apiKey, style]);

    useEffect(() => {
        // Only add markers after the map is initialized
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

    return (
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
                        ref={(el) => (sectionRefs.current[index] = el)} // Store reference to each section
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
            </div>
        </div>
    );
};

export default Map;
