import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const instruction = 'Given a question and an answer return a hint that helps the student understand the question without giving away the answer even in a different phrasing.';
    const criteria = 'Only output the hint. Hint should be one sentence and different from previous hints';
    const prompt = `${instruction}\n\n${criteria}`;
    const input = `Question: ${body.question}\nAnswer: ${body.answer}\nPrevious Hints: ${body.prev_hints}`;
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": input }
        ],
    })
    return completion.choices[0].message.content
});