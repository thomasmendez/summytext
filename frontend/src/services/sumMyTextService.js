import axios from 'axios';
const axiosRetry = require('axios-retry');

const baseUrl = process.env.SUM_MY_TEXT_SERVICE;

// 120s covers a Lambda cold start (~60s while the models load) with headroom.
// The backend is now behind a Lambda Function URL, not API Gateway, so the
// request is no longer cut off at the gateway's 30s ceiling -- we just wait.
const REQUEST_TIMEOUT_MS = 120000;

const axiosInstance = axios.create({ timeout: REQUEST_TIMEOUT_MS });

// Only retry genuine transient network errors, and only a couple of times with
// backoff. A cold start now completes on the first request, so we must NOT
// hammer it: each retry against a still-cold backend can spawn another cold
// container and make the wait worse.
axiosRetry(axiosInstance, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.code === 'ERR_NETWORK';
  },
});

export const performAnalysis = (text) => {
    return axiosInstance.post(`${baseUrl}/api/v1/predict/`, {
        text,
    });
};
