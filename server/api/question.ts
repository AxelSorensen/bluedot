import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const instruction = `Given a learning objective and a learning resource, return ${body.num_questions} questions and an answers that would help a student reach the learning objective.`;
    const criteria = ``
    const prompt = `${instruction}\n\n${criteria}`;
    const input = `Resource: ${body.resource}\nObjective: ${body.objective}`;
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": input }
        ],
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "question_answer",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "q_a": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "question": {
                                        "type": "string"
                                    },
                                    "answer": {
                                        "type": "string"
                                    }
                                },
                                "required": ["question", "answer"],
                                "additionalProperties": false
                            }
                        },
                    },
                    "required": ["q_a"],
                    "additionalProperties": false
                }
            }
        }
    })
    return JSON.parse(completion.choices[0].message.content)
});