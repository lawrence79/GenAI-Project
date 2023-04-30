const axios = require("axios");
const fs = require("fs");

async function translate(jsonData) {
    const languages = ["es", "fr", "de", "it", "pt", "zh", "ja", "ar"];
    const translatedData = {};

    for (const language of languages) {
        const response = await axios({
            method: "post",
            url: "https://api.cognitive.microsofttranslator.com/translate",
            params: {
                "api-version": "3.0",
                to: language,
            },
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "MSFT_TRANSLATE_API_KEY",
                "Ocp-Apim-Subscription-Region": "MSFT_TRANSLATE_API_REGION",
            },
            data: [
                {
                    text: JSON.stringify(jsonData, null, 4),
                },
            ],
        });

        const translatedValue = response.data[0].translations[0].text;
        translatedData[language] = translatedValue;
    }

    return translatedData;
}

// Example usage
const jsonData = {
    welcomeMessage: "Welcome to our website!",
    login: {
        username: "Username",
        password: "Password",
        signIn: "Sign In",
        forgotPassword: "Forgot password?",
        createAccount: "Create an account",
    },
    main: {
        header: "Welcome to the app!",
        new_messages_one: "You have one new message",
        new_messages_other: "You have {{count}} new messages",
        current_date: "Today is {{date, DATE_LONG}}",
        incoming_message: "You have a new message from {{from}}",
        message_contents: "They say: {{body}}",
        message_contents_male: "He says: {{body}}",
        message_contents_female: "She says: {{body}}",
    },
    navigation: {
        home: "Home",
        aboutUs: "About Us",
        contact: "Contact",
        products: "Products",
    },
    footer: {
        copyright: "© {{DATE_YEAR}} Company Name. All rights reserved.",
        termsOfService: "Terms of Service",
        privacyPolicy: "Privacy Policy",
    },
    profile: {
        settings: "Settings",
        logout: "Log Out",
    },
    product: {
        addToCart: "Add to Cart",
        buyNow: "Buy Now",
        price: "Price",
        description: "Description",
    },
    cart: {
        viewCart: "View Cart",
        checkout: "Checkout",
        total: "Total {{cart_total}}",
        emptyCartMessage: "Your cart is empty.",
    },
    errorMessages: {
        pageNotFound: "Page not found.",
        somethingWentWrong: "Oops! Something went wrong.",
    },
};

translate(jsonData)
    .then((translatedData) => {
        console.log(translatedData);
        fs.writeFileSync("translated.json", JSON.stringify(translatedData, null, 4));
    })
    .catch((error) => {
        console.error("Translation error:", error);
    });
