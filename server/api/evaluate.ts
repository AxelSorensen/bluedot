import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const instruction = 'Given a question and and the correct answer and a conversation history evaluate whether the user has demonstrated understanding of the answer through their replies.';
    const criteria = 'If yes, return the text: Passed! Otherwise ask a follow up question to help the user understand the question better. Never give the answer away to the user. Always refer to the original question';
    const prompt = `${instruction}\n\n${criteria}`;
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": `Question: ${body.question}\n\nCorrect Answer: ${body.answer}\n\nConversation: ${body.conversation}` }
        ],



    })
    return completion.choices[0].message.content
});