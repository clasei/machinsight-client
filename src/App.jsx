import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "./api";
import './App.css';

function App() {

    // const [message, setMessage] = useState("");

    // useEffect(() => {
    //     // Test the backend connection
    //     API.get("/")
    //         .then((response) => {
    //             setMessage(response.data.message);
    //         })
    //         .catch((error) => {
    //             console.error("Error connecting to the backend:", error);
    //         });
    // }, []);

    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch machine data from the backend
        axios.get("http://localhost:5005/api/machines")
            .then((response) => {
                setMachines(response.data.data); // Update state with machine data
                setLoading(false); // Stop loading once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching machine data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (

        // <div>
        //     <h1>MachInsight Client</h1>
        //     <p>Backend says: {message}</p>
        // </div>

        <div>
          <h1>Machine Data</h1>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Temperature</th>
                      <th>Vibration</th>
                      <th>Fuel Level</th>
                      <th>Status</th>
                      <th>Work Hours</th>
                      <th>Location</th>
                  </tr>
              </thead>
              <tbody>
                  {machines.map((machine) => (
                      <tr key={machine.id} className={machine.status}>
                      <td>{machine.id}</td>
                      <td>{machine.machineName}</td>
                      <td>{machine.temperature}°C</td>
                      <td>{machine.vibration} mm/s</td>
                      <td>{machine.fuelLevel}%</td>
                      <td>{machine.status}</td>
                      <td>{machine.workHours} hrs</td>
                      <td>{machine.location}</td>
                  </tr>                  
                  ))}
              </tbody>
          </table>
      </div>
    );
}

export default App;
