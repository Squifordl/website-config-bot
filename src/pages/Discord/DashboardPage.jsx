import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import defaultIcon from '../../assets/sexy.png';
import '../css/Discord/DashboardPage.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Identificamos que você não está logado, estamos o redirecionando para a pagina Login...</p>
        </div>
    );
};

function DashboardPage() {
    const navigate = useNavigate();
    const { isUserLoggedIn, isAuthenticating } = useAuth();
    const [servers, setServers] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        if (!isAuthenticating && !isUserLoggedIn) {
            setShowSpinner(true);
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        }

        const userId = localStorage.getItem('userId');
        fetch(`/api/servers/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('A resposta da rede não foi boa');
                }
                return response.json();
            })
            .then(data => setServers(data.servers))
            .catch(error => console.error('Ocorreu um problema com sua operação de busca:', error));
    }, [navigate, isUserLoggedIn, isAuthenticating]);

    const getIconUrl = useCallback((server) => {
        return server.icon
            ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
            : defaultIcon;
    }, []);

    return (
        <div className="dashboard">
            {showSpinner ? (
                <LoadingSpinner />
            ) : (
                <>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <h2 className="dashboard-subtitle">Servidores Compartilhados</h2>
                    <div className="server-list">
                        {servers.length > 0 ? (
                            servers.map(server => (
                                <div key={server.id} className="server-item" onClick={() => navigate(`/server/${server.id}`)}>
                                    <img className="server-icon" src={getIconUrl(server)} alt={server.name} />
                                    <h3 className="server-name">{server.name}</h3>
                                </div>
                            ))
                        ) : (
                            <div className="no-servers-message">
                                Nenhum servidor compartilhado encontrado.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default DashboardPage;