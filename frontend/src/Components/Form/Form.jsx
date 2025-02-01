import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
// import 'maplibre-gl/dist/maplibre-gl.css';
import "../Map/Map.css";
import "./Form.css";
const STYLE = {
  OUTDOOR: "outdoor",
  STREETS_DARK: "streets-dark",
  STREETS: "streets",
  WINTER: "winter",
  SATELLITE: "satellite",
};

export default function Form({ apiKey }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);

  const [style, setStyle] = useState(STYLE.OUTDOOR);

  const initialCenter = [-84.063429, 39.782072];

  const [pos, setPos] = useState([0, 0]);
  useEffect(() => {
    if (map.current) return;

    console.log("Initializing map");

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`,
      center: initialCenter,
      zoom: 17,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new maplibregl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);
      }

      setData((prev) => ({
        ...prev,
        location: { latitude: lat, longitude: lng },
      }));
    });
  }, [apiKey, style]);

  const handleStyleChange = (e) => {
    setStyle(e.target.value);
  };

  const [data, setData] = useState({
    name: "",
    location: { latitude: "", longitude: "" },
    photo_path: "",
    desk_number: "",
    hours: "",
    description: "",
    rooms: [],
    employee_list: { employee: [] },
  });

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLat = (value) => {
    const changeMe = data;

    changeMe.location.latitude = value;

    setData(changeMe);
  };

  const updateLon = (value) => {
    const changeMe = data;

    changeMe.location.longitude = value;

    setData(changeMe);
  };

  const updateLocation = (field, value) => {
    setData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const addRoom = () => {
    setData((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        { name: "", lead: "", time: "", description: "", room_number: "" },
      ],
    }));
  };

  const updateRoom = (index, field, value) => {
    const newRooms = [...data.rooms];
    newRooms[index][field] = value;
    setData((prev) => ({ ...prev, rooms: newRooms }));
  };

  const addEmployee = () => {
    setData((prev) => ({
      ...prev,
      employee_list: {
        employee: [
          ...prev.employee_list.employee,
          { name: "", phone_number: "", office: "", hours: "" },
        ],
      },
    }));
  };

  const updateEmployee = (index, field, value) => {
    const newEmployees = [...data.employee_list.employee];
    newEmployees[index][field] = value;
    setData((prev) => ({
      ...prev,
      employee_list: { employee: newEmployees },
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/building", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Check console for details.");
    }
  };

  return (
    <>
      <div className="form-container">
        <input
          placeholder="Name"
          value={data.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <input
          placeholder="Latitude"
          value={data.location.latitude}
          onChange={(e) => updateLat(e.target.value)}
        />
        <input
          placeholder="Longitude"
          value={data.location.longitude}
          onChange={(e) => updateLon(e.target.value)}
        />
        <input
          placeholder="Photo Path"
          value={data.photo_path}
          onChange={(e) => updateField("photo_path", e.target.value)}
        />
        <input
          placeholder="Desk Number"
          value={data.desk_number}
          onChange={(e) => updateField("desk_number", e.target.value)}
        />
        <input
          placeholder="Hours"
          value={data.hours}
          onChange={(e) => updateField("hours", e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <button onClick={addRoom}>Add Room</button>
        {data.rooms.map((room, index) => (
          <div key={index} className="room-container">
            <input
              placeholder="Room Name"
              value={room.name}
              onChange={(e) => updateRoom(index, "name", e.target.value)}
            />
            <input
              placeholder="Lead"
              value={room.lead}
              onChange={(e) => updateRoom(index, "lead", e.target.value)}
            />
            <input
              placeholder="Time"
              value={room.time}
              onChange={(e) => updateRoom(index, "time", e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={room.description}
              onChange={(e) => updateRoom(index, "description", e.target.value)}
            />
            <input
              placeholder="Room Number"
              value={room.room_number}
              onChange={(e) => updateRoom(index, "room_number", e.target.value)}
            />
          </div>
        ))}

        <button onClick={addEmployee}>Add Employee</button>
        {data.employee_list.employee.map((employee, index) => (
          <div key={index} className="employee-container">
            <input
              placeholder="Employee Name"
              value={employee.name}
              onChange={(e) => updateEmployee(index, "name", e.target.value)}
            />
            <input
              placeholder="Phone Number"
              value={employee.phone_number}
              onChange={(e) =>
                updateEmployee(index, "phone_number", e.target.value)
              }
            />
            <input
              placeholder="Office"
              value={employee.office}
              onChange={(e) => updateEmployee(index, "office", e.target.value)}
            />
            <input
              placeholder="Hours"
              value={employee.hours}
              onChange={(e) => updateEmployee(index, "hours", e.target.value)}
            />
          </div>
        ))}

        <button onClick={handleSubmit}>Submit</button>

        <pre className="json-output">{JSON.stringify(data, null, 2)}</pre>
      </div>

      <div className="map-container">
        <select value={style} onChange={handleStyleChange}>
          {Object.values(STYLE).map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
        <div
          ref={mapContainer}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        />
      </div>
    </>
  );
}
