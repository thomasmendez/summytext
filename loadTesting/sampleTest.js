import { sleep } from 'k6';
import post from './post.js';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    vus: 1,
    duration: '10s'
};

export default () => {
    post();
    sleep(1);
}