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
    justifyContent: 'center',
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

const RoleRow = ({ role, buttonLabel, onClick }) => (
    <div className="config-row">
        <span>
            <span className="role-name">Nome: </span>{role.name} ({role.id})
        </span>
        <button onClick={() => onClick(role)}>{buttonLabel}</button>
    </div>
);

const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('A resposta da rede não foi boa');
    return await response.json();
};

const VipConfigurationPage = () => {
    const [roles, setRoles] = useState([]);
    const [vipRoles, setVipRoles] = useState([]);
    const [initialVipRoles, setInitialVipRoles] = useState([]);
    const [showNoChanges, setShowNoChanges] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const serverID = window.location.pathname.split('/')[2];

    useEffect(() => {
        const fetchRolesAndVips = async () => {
            try {
                const { roles } = await fetchData(`/api/server/roles/${serverID}`);
                setRoles(roles);

                const { server } = await fetchData(`/api/server/info/${serverID}`);
                const vipRoles = await Promise.all(server.vip.map(({ id }) =>
                    fetchData(`/api/server/roles/${serverID}/${id}`)));

                setVipRoles(vipRoles);
                setInitialVipRoles([...vipRoles]);
            } catch (error) {
                console.error('Ocorreu um problema com sua operação de busca:', error);
            }
        };

        fetchRolesAndVips();
    }, [serverID]);

    const addVipRole = role => setVipRoles([...vipRoles, role]);
    const removeVipRole = role => setVipRoles(vipRoles.filter(r => r.id !== role.id));

    const saveVipRoles = async () => {
        const hasChanges = JSON.stringify(initialVipRoles) !== JSON.stringify(vipRoles);

        if (!hasChanges) {
            setShowNoChanges(true);
            setTimeout(() => setShowNoChanges(false), 3000);
            return;
        }

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
            {showNoChanges && <div className="no-changes-popup"><p>Nenhuma alteração para ser salva</p></div>}
            {showConfirmation && <ConfirmationPopup message="Configurações salvas com sucesso" onClose={() => setShowConfirmation(false)} />}
            <h1>Gerenciamento VIP</h1>
            <div className="config-section">
                <h2>Cargos Disponíveis</h2>
                <div className="role-list">
                    {roles.map(role => <RoleRow key={role.id} role={role} buttonLabel="Adicionar" onClick={addVipRole} />)}
                </div>
            </div>
            <div className="config-section">
                <h2>Cargos VIP Atuais</h2>
                <div className="vip-list">
                    {vipRoles.map(role => <RoleRow key={role.id} role={role} buttonLabel="Remover" onClick={removeVipRole} />)}
                </div>
            </div>
            <StyledButton onClick={saveVipRoles}>Salvar Configurações</StyledButton>
        </div>
    );
};

export default VipConfigurationPage;