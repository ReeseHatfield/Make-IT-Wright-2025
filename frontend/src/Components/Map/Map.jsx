import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
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
    const [buildingData, setBuildingData] = useState([]);

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

    useEffect(() => {
        const fetchBuildingData = async () => {
            const promises = coords.map(async ([lon, lat]) => {
                try {
                    const res = await fetch(`http://localhost:3000/building/closest?lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    return data;
                } catch (error) {
                    console.error("Error fetching building data:", error);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            setBuildingData(results);
        };

        if (coords.length > 0) {
            fetchBuildingData();
        }
    }, [coords]);

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
            <div style={{ display: 'flex', width: '100%', height: '100%', position: 'absolute' }}>
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
                    {buildingData.map((building, index) => (
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
                            {building ? (
                                <>
                                    <h3>{building.name || `Pin ${index + 1}`}</h3>
                                    <p><strong>Coordinates:</strong> {coords[index][0]}, {coords[index][1]}</p>
                                    <p><strong>Description:</strong> {building.description}</p>
                                    <p><strong>Hours:</strong> {building.hours}</p>
                                    {building.photo_path && (
                                        <img src={building.photo_path} alt={building.name} style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                                    )}
                                    <h4>Rooms:</h4>
                                    {building.rooms && building.rooms.length > 0 ? (
                                        building.rooms.map((room, i) => (
                                            <div key={i} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                                                <p><strong>Room Name:</strong> {room.name}</p>
                                                <p><strong>Room Number:</strong> {room.room_number}</p>
                                                <p><strong>Lead:</strong> {room.lead}</p>
                                                <p><strong>Time:</strong> {room.time}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No rooms available.</p>
                                    )}
                                    <h4>Employees:</h4>
                                    {building.employee_list && Object.keys(building.employee_list).length > 0 ? (
                                        Object.entries(building.employee_list).map(([department, employees]) => (
                                            <div key={department}>
                                                <h5>{department}</h5>
                                                {employees.map((employee, i) => (
                                                    <div key={i} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                                                        <p><strong>Name:</strong> {employee.name}</p>
                                                        <p><strong>Office:</strong> {employee.office}</p>
                                                        <p><strong>Phone:</strong> {employee.phone_number}</p>
                                                        <p><strong>Hours:</strong> {employee.hours}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No employees available.</p>
                                    )}
                                </>
                            ) : (
                                <p>Loading data...</p>
                            )}
                        </div>
                    ))}

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
                        <FormWrapper apiKey={apiKey} />
                    </div>
                </div>
            )}
        </>
    );
};

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
    position: 'absolute',
    width: '30%',
    height: '90%',
    maxWidth: '90%',
    overflowY: 'auto',
};

export default Map;
