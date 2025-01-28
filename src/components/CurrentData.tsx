import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/App.css';

// machine data structure ->
interface Machine {
    id: number;
    machineName: string;
    temperature: number;
    vibration: number;
    fuelLevel: number;
    status: "normal" | "warning" | "critical";
    workHours: number;
    location: string;
  }

  // function CurrentData() {
  // ---> React.FC added to define CurrentData as a functional component
  const CurrentData: React.FC = () => {
    // state variables + type (expected structure)
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Machine | null; direction: "asc" | "desc" }>({
      key: null,
      direction: "asc"
    });

    useEffect(() => {
        axios
          .get("http://localhost:5005/api/machines")
          .then((response) => {
            setMachines(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("error fetching machine data:", error);
            setLoading(false);
          });
      }, []); // empty dependency array -> run once on component mount

    // sortBy function to sort the machines based on the key argument
    const sortBy = (key: keyof Machine) => {
        let direction: "asc" | "desc" = "asc";
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
        } else if (typeof a[key] === "string" && typeof b[key] === "string") {
            return direction === "asc"
              ? a[key].localeCompare(b[key])
              : b[key].localeCompare(a[key]);
        } else if (typeof a[key] === "number" && typeof b[key] === "number") {
            // Numeric or default comparison
            return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
          }
          return 0;
        });
        
        setMachines(sortedMachines);
    };
    

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Machinsight: last data</h1>
            <table>
            <thead>
              <tr>
                  <th onClick={() => sortBy("id")} className={sortConfig.key === "id" ? "sorted" : ""}>ID</th>
                  <th onClick={() => sortBy("machineName")} className={sortConfig.key === "machineName" ? "sorted" : ""}>Name</th>
                  <th onClick={() => sortBy("temperature")} className={sortConfig.key === "temperature" ? "sorted" : ""}>Temperature</th>
                  <th onClick={() => sortBy("vibration")} className={sortConfig.key === "vibration" ? "sorted" : ""}>Vibration</th>
                  <th onClick={() => sortBy("fuelLevel")} className={sortConfig.key === "fuelLevel" ? "sorted" : ""}>Fuel Level</th>
                  <th onClick={() => sortBy("status")} className={sortConfig.key === "status" ? "sorted" : ""}>Status</th>
                  <th onClick={() => sortBy("workHours")} className={sortConfig.key === "workHours" ? "sorted" : ""}>Work Hours</th>
                  <th onClick={() => sortBy("location")} className={sortConfig.key === "location" ? "sorted" : ""}>Location</th>
              </tr>
          </thead>

          <tbody>
            {machines.map((machine) => (
                <tr
                    key={machine.id}
                    className={`status-${machine.status}`} // class name based on status
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

export default CurrentData;
