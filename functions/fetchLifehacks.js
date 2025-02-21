const axios = require('axios');

exports.handler = async (event) => {
    try {
        console.log("Function triggered!");

        // Check if API key is actually set
        if (!process.env.OPENAI_API_KEY) {
            console.error("❌ ERROR: OPENAI_API_KEY is missing from Netlify environment variables!");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Missing OpenAI API key in Netlify environment variables." }),
            };
        }

        console.log("✅ API Key is present!");

        const { query } = JSON.parse(event.body);
        if (!query) {
            console.log("❌ ERROR: No query provided!");
            return { statusCode: 400, body: JSON.stringify({ error: "Query is required." }) };
        }

        console.log(`🔎 Fetching lifehacks for: ${query}`);

        // Call OpenAI API
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
                    "Content-Type": "application/json"
                },
            }
        );

        console.log("✅ Received response from OpenAI:", response.data);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lifehacks: response.data.choices[0].message.content.trim().split(/\n(?=\d+\.\s+)/) }),
        };

    } catch (error) {
        console.error("❌ ERROR calling OpenAI API:", error.response?.data || error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.response?.data || "Request failed." }),
        };
    }
};
