import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const instruction = 'Given a learning resource, turn it into 5 short high level learning objectives.';
    const criteria = 'Only create objectives based on the input, if no learning objective can be extracted, return an empty list.';
    const prompt = `${instruction}\n\n${criteria}`;
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": `Input: ${body.text}` }
        ],
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "math_response",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "objectives": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "text": {
                                        "type": "string"
                                    },
                                },
                                "required": ["text"],
                                "additionalProperties": false

                            },

                        },
                    },
                    "required": ["objectives"],
                    "additionalProperties": false
                }
            }
        }

    });

    return JSON.parse(completion.choices[0].message.content)
});