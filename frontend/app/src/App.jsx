import { useState, useEffect } from "react";
import Map from "./Components/Map/Map";

function App() {
  const [key, setKey] = useState(null);

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
        <Map apiKey={key}></Map>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;

