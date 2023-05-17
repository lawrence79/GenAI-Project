const { Octokit } = require("@octokit/rest");
const { createTokenAuth } = require("@octokit/auth-token");
const openai = require("openai");

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

    const prompt = `Review the following code: \n\n${pullRequest}`; // update how you get code to review

    const chatModelsResponse = await openai.ChatCompletion.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const review = chatModelsResponse.data.choices[0].message.content;

    await octokit.pulls.createReview({
        owner: "owner", // update with your repo owner
        repo: "repo", // update with your repo name
        pull_number: process.env.GITHUB_PR_NUMBER, // update how you get PR number
        body: review,
        event: "COMMENT",
    });
}

run().catch(console.error);
