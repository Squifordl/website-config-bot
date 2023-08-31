import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BotConfigurationPage from '../pages/Discord/BotConfigurationPage';
import VipConfigurationPage from '../pages/Discord/VipConfigurationPage';


function ServerRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<BotConfigurationPage />} />
            <Route path="/vip" element={<VipConfigurationPage />} />
        </Routes>
    );
}

export default ServerRoutes;
