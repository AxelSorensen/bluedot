import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const instruction = 'Given a learning objective create a question that tests the knowledge of the objective.';
    const criteria = 'Only output the question';
    const prompt = `${instruction}\n\n${criteria}`;
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": body.text }
        ],
    })
    return completion.choices[0].message.content
});