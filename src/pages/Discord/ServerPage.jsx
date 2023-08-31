import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rings } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import defaultIcon from '../../assets/sexy.png';
import ServerRoutes from '../../routes/ServerRoutes'
import '../css/Discord/ServerPage.css';

function ServerPage() {
    const { serverId } = useParams();
    const [serverData, setServerData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/server/${serverId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setServerData(data.server))
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                setError("There was an error fetching the server data.");
            });
    }, [serverId]);

    const getIconUrl = (server) => {
        return server.icon
            ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
            : defaultIcon;
    }
    if (error) return (
        <div className="error-message">
            {error}
            <button onClick={() => window.location.reload()}>{('Try Again')}</button>
        </div>
    );

    if (!serverData) return <div className="loader-container"><Rings type="ThreeDots" color="#00BFFF" height={80} width={80} /></div>;

    return (
        <div className={`server-page`}>
            <div className="server-header">
                <img className="server-icon" src={getIconUrl(serverData)} alt={serverData.name} />
                <h1>{serverData.name}</h1>
            </div>
            <div className="sidebar-menu">
                <ul>
                    <li className="menu-item active"><Link to={`/server/${serverId}/dashboard`}>{('HOME')}</Link></li>
                    <li className="menu-item"><Link to={`/server/${serverId}/vip`}>{('VIP')}</Link></li>
                </ul>
            </div>
            <div className="main-content">
                <ServerRoutes />
            </div>
        </div>
    );
}

export default ServerPage;
