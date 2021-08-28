const { TranslatorTextClient } = require('@azure/cognitiveservices-translatortext');
const { CognitiveServicesCredentials } = require('@azure/ms-rest-azure-js');

module.exports = function () {
    const endpoint = process.env.TRANSLATOR_ENDPOINT;
    const key = process.env.TRANSLATOR_SECRET;
    const region = process.env.TRANSLATOR_REGION;

    const credentials = new CognitiveServicesCredentials(key);

    const client = new TranslatorTextClient(credentials, endpoint);

    async function translate(text, targetLanguage) {
        if (!text) return null;
        const result = await client.translator.translate([ targetLanguage ], [{ text }], {
            customHeaders: {
                'Ocp-Apim-Subscription-Region': region
            }
        });

        return result[0].translations[0].text;
    }

    return {
        translate
    };
}