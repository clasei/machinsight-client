import React, { useEffect, useState } from "react";
import API from "./api";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Test the backend connection
        API.get("/")
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error("Error connecting to the backend:", error);
            });
    }, []);

    return (
        <div>
            <h1>MachInsight Client</h1>
            <p>Backend says: {message}</p>
        </div>
    );
}

export default App;
