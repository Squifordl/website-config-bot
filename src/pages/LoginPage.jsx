import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import "./css/Login3D.css";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const clientId = "950988940209455144";
    const redirectUri = encodeURIComponent(`http://localhost:5000/oauth`);
    const responseType = "code";
    const scope = "guilds%20identify";

    const oauthUrl = useMemo(() => {
        return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    }, [clientId, redirectUri, responseType, scope]);

    const handleLoginClick = useCallback(() => {
        setIsLoading(true);
        try {
            window.location.href = oauthUrl;
        } catch (err) {
            setError('Algo deu errado ao tentar fazer login');
            setIsLoading(false);
        }
    }, [oauthUrl]);

    return (
        <div className={`login-container-3d`}>
            <Helmet>
                <title>'Login' | Squiford</title>
            </Helmet>
            <div className="login-box-3d">
                <h1 className="login-title-3d">'Bem-Vindo'</h1>
                <h2 className="login-subtitle-3d">'Faça login para começar'</h2>
                {isLoading ? (
                    <div className="discord-login-btn-3d">'Carregando...'</div>
                ) : (
                    <button onClick={handleLoginClick} className="discord-login-btn-3d">
                        'Faça login com Discord'
                    </button>
                )}
                {error && <p style={{ color: 'red' }}>{(error)}</p>}
            </div>
        </div>
    );
};

export default LoginPage;