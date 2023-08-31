import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import axios from 'axios';
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

function ConfirmationPopup({ message, onClose }) {
    return (
        <div className="confirmation-popup">
            <div className="confirmation-content">
                <p>{message}</p>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}

function BotConfigurationPage() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const serverID = window.location.pathname.split('/')[2];
    const [botSettings, setBotSettings] = useState({
        commandPrefix: "",
    });

    useEffect(() => {
        fetch(`/api/server/info/${serverID}`)
            .then(async (response) => {
                const data = await response.json();

                setBotSettings({
                    commandPrefix: data.server.prefix,
                });

            })
            .catch((error) => console.error(error));
    }, [serverID]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setBotSettings({
            ...botSettings,
            [e.target.name]: value
        });
    };

    const saveSettings = async () => {
        const response = await axios.post(`/api/server/settings/${serverID}`, botSettings).catch(error => {
            console.error("Houve um erro na solicitação:", error);
        });

        if (response && response.status === 200) {
            setShowConfirmation(true);
        }
    };

    const handleButtonClick = () => {
        saveSettings();
    };

    return (
        <div className="bot-config-container">
            <h1>'Configurações do bot'</h1>

            <div className="config-section">
                <div className="config-row">
                    <label>'Prefixo'</label>
                    <StyledTextField
                        name="commandPrefix"
                        value={botSettings.commandPrefix}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <StyledButton onClick={handleButtonClick}>Salvar Configurações</StyledButton>
            {showConfirmation && (
                <ConfirmationPopup
                    message="Configurações salvas com sucesso"
                    onClose={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
}

export default BotConfigurationPage;