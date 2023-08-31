import React, { useEffect, useState } from 'react';
import './css/CommandsPage.css';

function CommandsPage() {
    const [commands, setCommands] = useState([]);

    useEffect(() => {
        fetch('/api/commands')
            .then((res) => res.json())
            .then((data) => {
                setCommands(data.commands);
                console.log(data)
            });
    }, []);

    return (
        <div className="commands-container">
            <div className="button-container">
                <button className="btn" onClick={() => window.location.href = '/'}>Home</button>
                <button className="btn" onClick={() => window.location.href = '/login'}>Login</button>
                <button className="btn" onClick={() => window.location.href = '/dashboard'}>Dashboard</button>
            </div>
            <h1 className="commands-header">Lista de Comandos</h1>
            <section className="commands-section">
                {commands.map((command, index) => (
                    <div key={index} className="command-card">
                        <h3>{command.name}</h3>
                        <p>{command.description}</p>
                        <p><strong>Uso:</strong> {command.usage}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default CommandsPage;
