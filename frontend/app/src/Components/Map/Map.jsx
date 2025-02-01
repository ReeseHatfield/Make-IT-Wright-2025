import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css'; 

const STYLE = {
    OUTDOOR: "outdoor",
    STREETS_DARK: "streets-dark",
    STREETS: "streets",
    WINTER: "winter",
    SATELLITE: "satellite"
};

const Map = ({ apiKey }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markerRef = useRef(null);
    const [style, setStyle] = useState(STYLE.OUTDOOR);

    const initialCenter = [-84.063429, 39.782072];

    console.log("APIKEY:" + apiKey)

    useEffect(() => {
        if (map.current) return;

        console.log("Initializing map");

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`,
            center: initialCenter,
            zoom: 17,
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;

            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new maplibregl.Marker()
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            }

            // setPos({ x: lat, y: lng, z: 0 });
        });
    }, [apiKey]);

    useEffect(() => {
        if (map.current) {
            map.current.setStyle(`https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`);
        }
    }, [style]);

    const handleStyleChange = (e) => {
        setStyle(e.target.value);
    };

    return (
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
            <select value={style} onChange={handleStyleChange}>
                {Object.values(STYLE).map(style => (
                    <option key={style} value={style}>
                        {style}
                    </option>
                ))}
            </select>
            <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute' }} />
        </div>
    );
};

export default Map;
