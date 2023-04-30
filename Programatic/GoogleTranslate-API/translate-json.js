/**
 * This file was geneated using ChatGPT 3.5 Turbo
 * Some small edit were made to get it working with the Google Translate API and save to file
 */
const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;

// Your Google Cloud Platform project ID
const projectId = "Google Project ID";

// Creates a client
const translate = new Translate({ projectId });

const languages = ["es", "fr", "de", "it", "pt", "zh", "ja", "ar"];

async function translateJson(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const lang of languages) {
        const translatedData = await translateObject(data, lang);
        fs.writeFileSync(`${lang}_${filePath}`, JSON.stringify(translatedData, null, 2));
    }
}

async function translateObject(obj, target) {
    const translated = {};
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            const [translation] = await translate.translate(obj[key], target);
            translated[key] = translation;
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            translated[key] = await translateObject(obj[key], target);
        } else {
            translated[key] = obj[key];
        }
    }
    return translated;
}

translateJson("en.json");
