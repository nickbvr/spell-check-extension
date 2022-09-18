import { apiUrl } from '../../config/base.config';

export default class SpellCheck {
    constructor(api) {
        this.api = api;
    }

    async getSuggestions(word) {
        try {
            const resp = await this.api.post(apiUrl, {
                language: 'enUS',
                fieldvalues: word,
                config: {
                    forceUpperCase: false,
                    ignoreIrregularCaps: false,
                    ignoreFirstCaps: true,
                    ignoreNumbers: true,
                    ignoreUpper: false,
                    ignoreDouble: false,
                    ignoreWordsWithNumbers: true,
                },
            });
            const { spellingErrorCount, elements } = await resp.json();
            return spellingErrorCount && elements[0].errors[0].suggestions;
        } catch (err) {
            return console.error(err);
        }
    }
}
