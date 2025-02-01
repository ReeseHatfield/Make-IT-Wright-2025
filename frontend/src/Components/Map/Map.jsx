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

// Helper function to escape regex special characters.
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper function to highlight occurrences of query in text.
const highlightText = (text, query) => {
  if (!query || typeof text !== 'string') return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} style={{ backgroundColor: 'blue' }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const Map = ({ apiKey, coords = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [style, setStyle] = useState(STYLE.OUTDOOR);
  const [selectedPin, setSelectedPin] = useState(null);
  const sectionRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildingData, setBuildingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Track manual toggles for each building and its sub-sections.
  const [expandedBuildings, setExpandedBuildings] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [expandedEmployees, setExpandedEmployees] = useState({});

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
          if (sectionRefs.current[index]) {
            sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
          }
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

  // Filter buildingData by checking all attributes.
  const filteredBuildings = buildingData.filter(
    (building) =>
      building &&
      JSON.stringify(building).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%', position: 'absolute' }}>
        <div style={{ width: '70%', height: '100%' }}>
          <select
            value={style}
            onChange={handleStyleChange}
            style={{ position: 'absolute', zIndex: 10, top: '10px', left: '10px' }}
          >
            {Object.values(STYLE).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>

        <div style={{ width: '30%', padding: '10px', overflowY: 'auto', height: '100%' }}>
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />

          {filteredBuildings.map((building, index) => {
            // Auto-expand building if there's a search query and no manual override.
            const isBuildingExpanded =
              expandedBuildings[index] !== undefined
                ? expandedBuildings[index]
                : searchQuery !== ''
                ? true
                : false;

            // Auto-expand rooms and employees dropdowns when searched.
            const isRoomsExpanded =
              expandedRooms[index] !== undefined
                ? expandedRooms[index]
                : searchQuery !== '' ? true : false;
            const isEmployeesExpanded =
              expandedEmployees[index] !== undefined
                ? expandedEmployees[index]
                : searchQuery !== '' ? true : false;

            return (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                style={{ marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {/* Building Header */}
                <div
                  onClick={() =>
                    setExpandedBuildings((prev) => ({
                      ...prev,
                      [index]: !isBuildingExpanded,
                    }))
                  }
                  style={{
                    backgroundColor: '#eee',
                    padding: '10px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <h3 style={{ margin: 0 }}>
                    {highlightText(building.name || `Pin ${index + 1}`, searchQuery)}
                  </h3>
                </div>

                {/* Building Content */}
                {isBuildingExpanded && (
                  <div style={{ padding: '10px' }}>
                    <p>
                      <strong>Coordinates:</strong> {coords[index][0]}, {coords[index][1]}
                    </p>
                    <p>
                      <strong>Description:</strong> {highlightText(building.description, searchQuery)}
                    </p>
                    <p>
                      <strong>Hours:</strong> {highlightText(building.hours, searchQuery)}
                    </p>
                    {building.photo_path && (
                      <img
                        src={building.photo_path}
                        alt={building.name}
                        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }}
                      />
                    )}

                    {/* Rooms Dropdown */}
                    <div style={{ marginTop: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                      <div
                        onClick={() =>
                          setExpandedRooms((prev) => ({
                            ...prev,
                            [index]: !isRoomsExpanded,
                          }))
                        }
                        style={{
                          backgroundColor: '#ddd',
                          padding: '8px',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <strong>Rooms</strong>
                      </div>
                      {isRoomsExpanded && (
                        <div style={{ padding: '10px' }}>
                          {building.rooms && building.rooms.length > 0 ? (
                            building.rooms.map((room, i) => (
                              <div key={i} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                                <p>
                                  <strong>Room Name:</strong>{' '}
                                  {highlightText(room.name, searchQuery)}
                                </p>
                                <p>
                                  <strong>Room Number:</strong>{' '}
                                  {highlightText(String(room.room_number), searchQuery)}
                                </p>
                                <p>
                                  <strong>Lead:</strong>{' '}
                                  {highlightText(room.lead, searchQuery)}
                                </p>
                                <p>
                                  <strong>Time:</strong>{' '}
                                  {highlightText(room.time, searchQuery)}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No rooms available.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Employees Dropdown */}
                    <div style={{ marginTop: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                      <div
                        onClick={() =>
                          setExpandedEmployees((prev) => ({
                            ...prev,
                            [index]: !isEmployeesExpanded,
                          }))
                        }
                        style={{
                          backgroundColor: '#ddd',
                          padding: '8px',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <strong>Employees</strong>
                      </div>
                      {isEmployeesExpanded && (
                        <div style={{ padding: '10px' }}>
                          {building.employee_list &&
                          Object.keys(building.employee_list).length > 0 ? (
                            Object.entries(building.employee_list).map(([department, employees]) => (
                              <div key={department} style={{ marginBottom: '10px' }}>
                                <h5>{highlightText(department, searchQuery)}</h5>
                                {employees.map((employee, i) => (
                                  <div key={i} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                                    <p>
                                      <strong>Name:</strong>{' '}
                                      {highlightText(employee.name, searchQuery)}
                                    </p>
                                    <p>
                                      <strong>Office:</strong>{' '}
                                      {highlightText(employee.office, searchQuery)}
                                    </p>
                                    <p>
                                      <strong>Phone:</strong>{' '}
                                      {highlightText(employee.phone_number, searchQuery)}
                                    </p>
                                    <p>
                                      <strong>Hours:</strong>{' '}
                                      {highlightText(employee.hours, searchQuery)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                            <p>No employees available.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

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
