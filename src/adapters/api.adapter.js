import { apiKey } from '../../config/base.config';

export default class ApiAdapter {
    post = (url, body, options) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'jspell-checker.p.rapidapi.com',
            },
            ...options,
        });
    };
}
