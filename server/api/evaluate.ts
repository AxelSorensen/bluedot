import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const instruction = 'Given a learning objective, a question and an answer, evaluate whether the answer fullfills the learning objective';
    const criteria = 'If the answer fullfills the learning objective return the text: Passed! Otherwise provide a follow up question that would help the user understand the learning objective better.';
    const prompt = `${instruction}\n\n${criteria}`;
    const openai = new OpenAI();
    console.log(body);
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": `Learning Objective: ${body.objective}\n\nQuestion: ${body.question}\n\nAnswer: ${body.answer}` }
        ],
    })
    return completion.choices[0].message.content
});