import axios from 'axios';
const axiosRetry = require('axios-retry');

const baseUrl = process.env.SUM_MY_TEXT_SERVICE;

const axiosInstance = axios.create();

axiosRetry(axiosInstance, {
  retries: 5, // Number of retries on failure
  retryDelay: (retryCount) => {
    return retryCount * 10000; // Delay between retries (in milliseconds)
  },
  retryCondition: (error) => {
    // Custom retry condition
    return error.response && error.response.status >= 500; // Retry only for 5xx errors
  },
});

export const performAnalysis = (text) => {
    return axiosInstance.post(`${baseUrl}/api/v1/predict`, {
        text,
    });
};