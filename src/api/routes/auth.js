const express = require('express');
const router = express.Router();
const { request } = require("undici");
const jwt = require("jsonwebtoken");
const UserTeste = require("../database/Schema/User.js");

router.get("/", async (req, res) => {
    const { code } = req.query;

    if (code) {
        try {
            const tokenResponseData = await request(
                "https://discord.com/api/oauth2/token",
                {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code,
                        grant_type: "authorization_code",
                        redirect_uri: `http://localhost:5000/oauth`,
                        scope: "guilds%20identify",
                    }).toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            const oauthData = await tokenResponseData.body.json();

            const userResult = await request("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });

            const user = await userResult.body.json();

            await UserTeste.findOneAndUpdate({ idU: user.id }, { acesstoken: oauthData.access_token }, { new: true });

            const token = jwt.sign({ idU: user.id, acesstoken: oauthData.access_token }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });

            const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + threeDaysInMilliseconds),
                secure: true,
            });

            res.redirect(
                `http://localhost:5000/callback?code=${code}&userId=${user.id}&username=${user.username}&avatar=${user.avatar}&discriminator=${user.discriminator}&acesstoken=${token}`
            );

        } catch (error) {
            console.error(error);
        }
    }
});

module.exports = router;