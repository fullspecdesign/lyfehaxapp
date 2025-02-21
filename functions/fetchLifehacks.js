const axios = require('axios');

exports.handler = async (event) => {
    try {
        // Parse the request body to get the query
        const { query } = JSON.parse(event.body);

        if (!query) {
            return { statusCode: 400, body: JSON.stringify({ error: "Query is required" }) };
        }

        // Make the OpenAI API call with the same formatting instructions
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content:
                        'You are a helpful assistant providing lifehacks. When given a problem, provide 3-5 detailed and structured lifehacks to solve it. Each lifehack should include: 1. A clear title or description of the solution. 2. Step-by-step instructions (as bullet points). 3. Any necessary materials or tools. Format the response as a numbered list for clarity. For example:\n\n1. **Lifehack: Fast Ripening of Avocados**\n   - Materials: Avocado, Aluminum foil, Oven, Baking sheet.\n   - Instructions:\n     • Preheat your oven to 200°F.\n     • Wrap your avocado tightly in aluminum foil.\n     • Place the wrapped avocado on a baking sheet and put it in the oven.\n     • Check the avocado every ten minutes. The avocado should be ready in around an hour.\n\n2. **Lifehack: Easy Peeling of Garlic**\n   - Materials: Garlic, Two stainless steel bowls, Cutting board.\n   - Instructions:\n     • Take a full head of garlic and place it on a cutting board.\n     • Press down firmly on the head of garlic with the heel of your hand to separate the cloves.\n     • Put the cloves in a stainless steel bowl.\n     • Cover the bowl with another stainless steel bowl of the same size.\n     • Shake the two bowls together for a few seconds. The friction will peel the garlic cloves.',
                    },
                    { role: 'user', content: `Give me lifehacks for: ${query}` },
                ],
                max_tokens: 700,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        // Get the response from OpenAI
        const generatedResponse = response.data.choices[0].message.content.trim();

        // Remove any leading statements (e.g., "Sure, here are three lifehacks...")
        const lifehacksOnly = generatedResponse.replace(/^.*?\n(?=\d+\.\s+)/, '');

        // Split the response into individual lifehacks based on numbered list format
        const splitResults = lifehacksOnly
            .split(/\n(?=\d+\.\s+)/) // Split by numbered list (e.g., "1. ", "2. ", etc.)
            .filter((result) => result.trim() !== ''); // Remove empty strings

        // Return the results
        return {
            statusCode: 200,
            body: JSON.stringify({ lifehacks: splitResults }),
        };

    } catch (error) {
        console.error('Error fetching AI response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch lifehacks. Please try again." }),
        };
    }
};
