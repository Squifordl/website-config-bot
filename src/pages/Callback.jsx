import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Callback.css";

const Callback = () => {
    const history = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const username = params.get("username");
    const avatar = params.get("avatar");
    const discriminator = params.get("discriminator");
    const acesstoken = params.get("acesstoken");

    useEffect(() => {
        const fetchData = async () => {
            if (userId && username) {
                localStorage.setItem("token", `${acesstoken}`);
                localStorage.setItem("userId", `${userId}`);
                localStorage.setItem("username", `${username}`);
                localStorage.setItem("avatar", `${avatar}`);
                localStorage.setItem("discriminator", `${discriminator}`);
                localStorage.removeItem("user");

                try {
                    history("/dashboard");
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [history, userId, username, avatar, discriminator, acesstoken]);

    return (
        <div className={`callback-container`}>
            <h1>'Processando login...'</h1>
        </div>
    );
};

export default Callback;
