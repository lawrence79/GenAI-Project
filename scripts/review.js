const { Octokit } = require("@octokit/rest");
const axios = require("axios");
const { createTokenAuth } = require("@octokit/auth-token");

async function run() {
    const octokit = new Octokit({
        authStrategy: createTokenAuth,
        auth: process.env.GITHUB_TOKEN,
    });

    const { data: pullRequest } = await octokit.pulls.get({
        owner: "owner", // update with your repo owner
        repo: "repo", // update with your repo name
        pull_number: process.env.GITHUB_PR_NUMBER, // update how you get PR number
    });

    const chatModelsResponse = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
            prompt: `Review the following code: \n\n${pullRequest}`, // update how you get code to review
            max_tokens: 200,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    const review = chatModelsResponse.data.choices[0].text;

    await octokit.pulls.createReview({
        owner: "owner", // update with your repo owner
        repo: "repo", // update with your repo name
        pull_number: process.env.GITHUB_PR_NUMBER, // update how you get PR number
        body: review,
        event: "COMMENT",
    });
}

run().catch(console.error);
