import request from 'request-promise';

export default class {
    constructor() {
        this.apiKey = process.env.OWM_API_KEY;
    }

    request(url) {
        return request.get(url).then(JSON.parse).then(response => {
            if (response.cod !== '200') {
                throw new Error('Request to OWM failed');
            }

            return response;
        });
    }

    weatherForText(place) {
        return this.request(`http://api.openweathermap.org/data/2.5/forecast/daily?q=${encodeURIComponent(place)}&cnt=3&APPID=${this.apiKey}`);
    }

    weatherForLocation(lat, lon) {
        return this.request(`http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=3&APPID=${this.apiKey}`);
    }
}
