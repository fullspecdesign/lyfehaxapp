const axios = require('axios');

exports.handler = async (event) => {
    try {
        console.log("Function triggered!");

        const { query } = JSON.parse(event.body);
        if (!query) {
            console.log("No query provided!");
            return { statusCode: 400, body: JSON.stringify({ error: "Query is required" }) };
        }

        console.log(`Fetching lifehacks for: ${query}`);

        // Set a timeout to avoid Netlify function timing out
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // Timeout at 8 seconds

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: "You are a helpful assistant providing lifehacks." },
                    { role: 'user', content: `Give me lifehacks for: ${query}` }
                ],
                max_tokens: 400,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                signal: controller.signal, // Attach the timeout controller
            }
        );

        clearTimeout(timeout); // Clear timeout if API responds in time
        console.log("Received response from OpenAI");

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lifehacks: response.data.choices[0].message.content.trim().split(/\n(?=\d+\.\s+)/) }),
        };

    } catch (error) {
        console.error("Error calling OpenAI API:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Request timed out or OpenAI did not respond in time." }),
        };
    }
};
