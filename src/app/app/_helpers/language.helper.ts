import {config} from './config.helper';

export class LanguageHelper {
    languages: Array<object>;

    constructor(languages: Array<object> = []) {
        if (languages.length) {
            this.languages = languages;
        } else {
            this.languages = config.languages;
        }
    }

    getLanguageById(id: number): object {
        for (let language of this.languages) {
            if (language["id"] == id) return language;
        }

        return null;
    }

    getLanguages(): object {
        return this.languages;
    }
}
