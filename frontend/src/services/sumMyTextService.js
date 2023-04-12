import axios from 'axios';

const baseUrl = process.env.SUM_MY_TEXT_SERVICE;

const axiosInstance = axios.create();

export const performAnalysis = (text) => {
    return axiosInstance.post(`${baseUrl}/api/v1/predict`, {
        text,
    });
};