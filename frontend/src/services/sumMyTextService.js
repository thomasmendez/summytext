import axios from 'axios';
const axiosRetry = require('axios-retry');

const baseUrl = process.env.SUM_MY_TEXT_SERVICE;

const axiosInstance = axios.create();

axiosRetry(axiosInstance, {
  retries: 10, 
  retryCondition: (error) => {
    return error.code === 'ERR_NETWORK';
  },
});

export const performAnalysis = (text) => {
    return axiosInstance.post(`${baseUrl}/api/v1/predict/`, {
        text,
    });
};