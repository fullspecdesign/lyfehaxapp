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
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: "You are a helpful assistant providing lifehacks. When given a problem, provide 2 detailed and structured lifehacks to solve it. Each lifehack should include: 1. A clear title or description of the solution. 2. Step-by-step instructions (as bullet points). 3. Any necessary materials or tools. Format the response as a numbered list for clarity. For example:\n\n1. **Lifehack: Fast Ripening of Avocados**\n   - Materials: Avocado, Aluminum foil, Oven, Baking sheet.\n   - Instructions:\n     • Preheat your oven to 200°F.\n     • Wrap your avocado tightly in aluminum foil.\n     • Place the wrapped avocado on a baking sheet and put it in the oven.\n     • Check the avocado every ten minutes. The avocado should be ready in around an hour.\n\n2. **Lifehack: Easy Peeling of Garlic**\n   - Materials: Garlic, Two stainless steel bowls, Cutting board.\n   - Instructions:\n     • Take a full head of garlic and place it on a cutting board.\n     • Press down firmly on the head of garlic with the heel of your hand to separate the cloves.\n     • Put the cloves in a stainless steel bowl.\n     • Cover the bowl with another stainless steel bowl of the same size.\n     • Shake the two bowls together for a few seconds. The friction will peel the garlic cloves." },
                    { role: 'user', content: `Give me lifehacks for: ${query}` }
                ],
                max_tokens: 250,
                temperature: 0.5,
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
