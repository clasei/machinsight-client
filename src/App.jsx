import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        axios.get("http://localhost:5005/api/machines")
            .then((response) => {
                setMachines(response.data.data); 
                setLoading(false); 
            })
            .catch((error) => {
                console.error("Error fetching machine data:", error);
                setLoading(false);
            });
    }, []);

    const sortBy = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    
        const sortedMachines = [...machines].sort((a, b) => {
            if (key === "status") {
                // Custom order for status
                const statusOrder = { normal: 1, warning: 2, critical: 3 };
                return direction === "asc"
                    ? statusOrder[a[key]] - statusOrder[b[key]]
                    : statusOrder[b[key]] - statusOrder[a[key]];
            } else if (typeof a[key] === "string") {
                // Case-insensitive string comparison
                return direction === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            } else {
                // Numeric or default comparison
                return direction === "asc"
                    ? a[key] - b[key]
                    : b[key] - a[key];
            }
        });
        setMachines(sortedMachines);
    };
    

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Machine Data</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortBy("id")}>ID</th>
                        <th onClick={() => sortBy("machineName")}>Name</th>
                        <th onClick={() => sortBy("temperature")}>Temperature</th>
                        <th onClick={() => sortBy("vibration")}>Vibration</th>
                        <th onClick={() => sortBy("fuelLevel")}>Fuel Level</th>
                        <th onClick={() => sortBy("status")}>Status</th>
                        <th onClick={() => sortBy("workHours")}>Work Hours</th>
                        <th onClick={() => sortBy("location")}>Location</th>
                    </tr>
                </thead>
                <tbody>
    {machines.map((machine) => (
        <tr
            key={machine.id}
            className={`status-${machine.status}`} // Add a class based on status to style rows
        >
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
