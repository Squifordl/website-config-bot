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
            setError(('Something went wrong while trying to login'));
            setIsLoading(false);
        }
    }, [oauthUrl]);

    return (
        <div className={`login-container-3d`}>
            <Helmet>
                <title>{('Login')} | Squiford</title>
            </Helmet>
            <video autoPlay muted loop className="background-video">
                <source src="/galaxy.mp4" type="video/mp4" />
            </video>
            <div className="login-box-3d">
                <h1 className="login-title-3d">{('Welcome')}</h1>
                <h2 className="login-subtitle-3d">{('Log in to get started')}</h2>
                {isLoading ? (
                    <div className="discord-login-btn-3d">{('Loading...')}</div>
                ) : (
                    <button onClick={handleLoginClick} className="discord-login-btn-3d">
                        {('Log in with Discord')}
                    </button>
                )}
                {error && <p style={{ color: 'red' }}>{(error)}</p>}
            </div>
        </div>
    );
};

export default LoginPage;