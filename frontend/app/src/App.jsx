import { useState, useEffect } from "react";
import Map from "./Components/Map/Map";

function App() {
  const [key, setKey] = useState(null);


  const tempCoords = [
    [-84.063429, 39.782072],
    [-84.060500, 39.780500],
    [-84.065000, 39.783000]
  ];


  useEffect(() => {
    fetch("http://localhost:3000/getkey")
      .then((response) => response.json())
      .then((message) => setKey(message.key))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Data from Server</h1>
      {key ? (
        <Map apiKey={key} coords={tempCoords} ></Map>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;

