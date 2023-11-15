import axios from "axios";
import refreshAcessToken from "./oauth-api";

const jasminApi = axios.create({
    baseURL: `https://my.jasminsoftware.com/api/${process.env.TENANT}/${process.env.ORGANIZATION}`,
});

jasminApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshAcessToken();

            jasminApi.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return jasminApi(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default jasminApi;