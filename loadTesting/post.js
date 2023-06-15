import http from "k6/http";

const payload = JSON.stringify({
    text: "I bought a pack of 3 white chargers. Out the box, the first one I tried did start charging my phone, however, the charging icon on my phone disappeared in a few seconds. I realized that the charger block was loose in the wall socket so I tried to push it back in, but it basically fell out with a light touch. I tried the second charging block and the same thing happened. I gave up trying the third. Not worth it if one cannot plug the charging block into the wall socket directly.",
});

export default () => {
    return http.post(
        'http://localhost:8000/api/v1/predict/',
        payload
    )
}