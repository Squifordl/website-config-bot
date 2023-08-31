import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import '../css/Discord/VipConfigurationPage.css';

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
function VipConfigurationPage() {
    const [roles, setRoles] = useState([]);
    const [vipRoles, setVipRoles] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const serverID = window.location.pathname.split('/')[2];

    useEffect(() => {
        fetch(`/api/server/roles/${serverID}`).then(response => {
            if (!response.ok) {
                throw new Error('A resposta da rede não foi boa');
            }
            return response.json();
        }).then(data => {
            setRoles(data.roles);
        }).catch(error => {
            console.error('Ocorreu um problema com sua operação de busca:', error);
        });

        fetch(`/api/server/info/${serverID}`).then(response => {
            if (!response.ok) {
                throw new Error('A resposta da rede não foi boa');
            }
            return response.json();
        }).then(data => {
            const vipRoleIds = data.server.vip;
            return Promise.all(
                vipRoleIds.map(id => fetch(`/api/server/roles/${serverID}/${id.id}`)
                    .then(response => response.json())
                )
            );
        }).then(vipRoleDetails => {
            setVipRoles(vipRoleDetails.map(detail => detail.role));
        }).catch(error => {
            console.error('Ocorreu um problema com sua operação de busca:', error);
        });
    }, [serverID]);


    const addVipRole = (role) => {
        setVipRoles([...vipRoles, role]);
    };

    const removeVipRole = (role) => {
        setVipRoles(vipRoles.filter(r => r.id !== role.id));
    };

    const saveVipRoles = async () => {
        const apiUrl = `/api/server/saveVipRoles/${serverID}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vipRoles })
            });

            if (!response.ok) {
                throw new Error('A resposta da rede não foi boa');
            }

            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000);

        } catch (error) {
            console.error('Ocorreu um problema ao salvar funções VIP:', error);
        }
    };

    return (
        <div className="vip-config-container">
            {showConfirmation && (
                <ConfirmationPopup
                    message="Configurações salvas com sucesso"
                    onClose={() => setShowConfirmation(false)}
                />
            )}
            <h1>Gerenciamento VIP</h1>
            <div className="config-section">
                <h2>Cargos Disponíveis</h2>
                <div className="role-list">
                    {roles.map((role) => (
                        <div key={role.id} className="config-row">
                            <span>
                            <span className="role-name">Nome: </span>{role.name} ({role.id})
                            </span>
                            <button onClick={() => addVipRole(role)}>Adicionar</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="config-section">
                <h2>Cargos VIP Atuais</h2>
                <div className="vip-list">
                    {vipRoles.map((role) => (
                        <div key={role.id} className="config-row">
                            <span>
                                <span className="role-name">Nome: </span>{role.name} ({role.id})
                            </span>
                            <button onClick={() => removeVipRole(role)}>Remover</button>
                        </div>
                    ))}
                </div>
            </div>
            <StyledButton onClick={saveVipRoles}>Salvar Configurações</StyledButton>
        </div>
    );
}

export default VipConfigurationPage;