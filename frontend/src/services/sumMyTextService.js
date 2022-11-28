import axios from 'axios';

const baseUrl = process.env.SUM_MY_TEXT_SERVICE;

const axiosInstance = axios.create({
    baseUrl: baseUrl,
});

export const performAnalysis = (reqBody) => {
    return axiosInstance.post('/v1/predict', { reqBody });
};