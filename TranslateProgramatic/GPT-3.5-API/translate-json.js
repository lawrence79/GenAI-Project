/**
 * This file was geneated using ChatGPT 3.5 Turbo
 * Some small edit were made to get it working with the Google Translate API and save to file
 */

const fs = require("fs");

async function translateJSON(jsonContent, languages) {
    const apiKey = "OPENAI API KEY";
    const baseUrl = "https://api.openai.com/v1/completions";

    const translations = {};
    for (const language of languages) {
        const prompt = `Translate the following JSON key's values into ${language}:\n\n${JSON.stringify(jsonContent, null, 2)}`;
        console.log(prompt);
        const requestBody = {
            prompt,
            model: "text-davinci-003", // @TODO we should test different models
            temperature: 0,
            max_tokens: 4000, // Test different values
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        };

        const response = await fetch(baseUrl, requestOptions);
        const data = await response.json();
        const translation = data.choices[0].text.trim();
        translations[language] = translation;
    }

    return translations;
}

const jsonContent = {
    welcomeMessage: "Welcome to our website!",
    login: {
        username: "Username",
        password: "Password",
        signIn: "Sign In",
        forgotPassword: "Forgot password?",
        createAccount: "Create an account",
    },
};

const languages = ["Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Arabic"];

function writeNestedJSONToFile(obj, filePath) {
    const jsonString = obj;

    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("File written successfully.");
        }
    });
}

translateJSON(jsonContent, languages)
    .then((translations) => {
        for (const language of languages) {
            const translatedJSON = translations[language];
            const translatedFilePath = `${language.toLowerCase()}.json`;
            writeNestedJSONToFile(translatedJSON, translatedFilePath);
        }
    })
    .catch((error) => {
        console.error("Translation error:", error);
    });
