import { useState, useEffect } from "react";
import Map from "./Components/Map/Map";
import Login from "./Components/Login/Login";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [key, setKey] = useState(null);
  const [coords, setCoords] = useState([]);

  // Use navigate within the component
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fetch("http://localhost:3000/getCoords");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoords(data.map(({ latitude, longitude }) => [longitude, latitude]));
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };
  
    const fetchKey = async () => {
      try {
        const res = await fetch("http://localhost:3000/getkey");
        const message = await res.json();
        setKey(message.key);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
  
    fetchCoords();
    fetchKey();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              <h1>Darkleaf Labs</h1>
              {key ? <Map apiKey={key} coords={coords} /> : <p>Loading...</p>}
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              <h1>Login</h1>
              {key ? <Login /> : <p>Loading...</p>}
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              <h1>Login</h1>
              {key ? <Login /> : <p>Loading...</p>}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
