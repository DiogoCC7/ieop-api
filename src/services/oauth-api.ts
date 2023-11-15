import axios from "axios";

const token = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

const oauthApi = axios.create({
    baseURL: "https://identity.primaverabss.com/connect",
});

export default async function refreshAcessToken() {
    const response = await oauthApi.post("/token", "grant_type=client_credentials", {
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            Authorization: `Basic ${token}`
        },
    });

    return response.data.access_token;
}