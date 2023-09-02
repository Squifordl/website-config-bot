import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import '../css/Discord/BotConfigurationPage.css';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        background: 'none',
        border: 'none',
        borderBottom: '1px solid var(--border-color)',
        padding: '10px',
        color: 'var(--text-color)',
        transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
        width: '100%',
        paddingLeft: '5px',
        paddingBottom: '10px',
        outline: 'none',

        '&:focus': {
            borderColor: 'var(--input-focus-border-color)',
            boxShadow: '0 3px 15px rgba(0, 0, 0, 0.2)',
        },

        '&::placeholder': {
            color: 'var(--input-placeholder-color)',
            opacity: 0.7,
        },
    },
});

const StyledButton = styled(Button)({
    backgroundColor: 'var(--button-bg-color)',
    color: 'var(--button-text-color)',
    borderRadius: '5px',
    padding: '10px 15px',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        backgroundColor: 'var(--button-hover-bg-color)',
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.2)',
    },
    '&:active': {
        backgroundColor: 'var(--button-active-bg-color)',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
    },
});

const ConfirmationPopup = ({ message, onClose }) => (
    <div className="confirmation-popup">
        <div className="confirmation-content">
            <p>{message}</p>
            <button onClick={onClose}>Fechar</button>
        </div>
    </div>
);

const fetchSettings = async (serverID, setBotSettings, setInitialBotSettings) => {
    try {
        const response = await fetch(`/api/server/info/${serverID}`);
        const data = await response.json();
        setBotSettings({ commandPrefix: data.server.prefix });
        setInitialBotSettings({ commandPrefix: data.server.prefix });
    } catch (error) {
        console.error(error);
    }
};

const BotConfigurationPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const serverID = window.location.pathname.split('/')[2];
    const [botSettings, setBotSettings] = useState({ commandPrefix: "" });
    const [initialBotSettings, setInitialBotSettings] = useState({});

    useEffect(() => {
        fetchSettings(serverID, setBotSettings, setInitialBotSettings);
    }, [serverID]);

    const handleChange = e => {
        setBotSettings({ ...botSettings, [e.target.name]: e.target.value });
    };

    const saveSettings = async () => {
        try {
            const response = await axios.post(`/api/server/settings/${serverID}`, botSettings);
            if (response.status === 200) {
                setPopupMessage('Configurações salvas com sucesso');
                setShowPopup(true);
            }
        } catch (error) {
            console.error("Houve um erro na solicitação:", error);
        }
    };

    const handleButtonClick = () => {
        const hasChanges = JSON.stringify(initialBotSettings) !== JSON.stringify(botSettings);

        if (!hasChanges) {
            setPopupMessage('Nenhuma alteração para ser salva');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }

        saveSettings();
    };

    return (
        <div className="bot-config-container">
            <h1>Configurações do bot</h1>
            <div className="config-section">
                <div className="config-row">
                    <label>Prefixo</label>
                    <StyledTextField
                        name="commandPrefix"
                        value={botSettings.commandPrefix}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <StyledButton onClick={handleButtonClick}>Salvar Configurações</StyledButton>
            {showPopup && (
                <ConfirmationPopup message={popupMessage} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default BotConfigurationPage;