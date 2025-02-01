import { useState, useEffect } from "react";
import Map from "./Components/Map/Map";
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import {  useNavigate} from 'react-router-dom';


function App() {
  const [key, setKey] = useState(null);
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/getCoords")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Convert { latitude, longitude } to [longitude, latitude]
          const formattedCoords = data.map(({ latitude, longitude }) => [longitude, latitude]);
          setCoords(formattedCoords);
        } else {
          console.error("Unexpected data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching coordinates:", error));

    fetch("http://localhost:3000/getkey")
      .then((response) => response.json())
      .then((message) => setKey(message.key))
      .catch((error) => console.error("Error fetching API key:", error));
  }, []);


  

  return( 
    
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              <h1>Data from Server</h1>
              {key ? <Map apiKey={key} coords={coords} /> : <p>Loading...</p>}
            </div>
        
        }/>

        <Route path="/login" element={
          <h1> Pretend this sia  login screen</h1>
        }/>
        <Route path="/" element= {
          <h1> Pretend this sia  login screen</h1>
        }/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
