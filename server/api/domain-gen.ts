import OpenAI from "openai";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    let system_instruction = `Generate ${body.num_domains} domain names (without TLD's) based on the following instructions:`
    if (body.similar_names.length) {
        system_instruction += `The domains should be similar to the (in the overall vibe of the domain name): ${body.similar_names}`
    }

    if (body.use_words.length) {
        system_instruction += `The domain should include or be made up combinations of the following word/words: ${body.use_words}`
    }
    if (body.old_domains) {
        system_instruction += `The following domains have already been suggested come up with different ones: ${body.old_domains}`
    }
    const user_instruction = body.instruction
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": system_instruction },
            { "role": "user", "content": user_instruction }
        ],
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "domain_response",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "domains": {
                            "type": "array",
                            "items": {
                                "type": "string",
                            }
                        },
                    },
                    "required": ["domains"],
                    "additionalProperties": false
                }
            }
        }

    })
    return JSON.parse(completion.choices[0].message.content)
});