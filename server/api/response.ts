import OpenAI from "openai";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const system_instruction = body.player == 1 ? 'Your goal is to convince the other player to give you the flag. You win if the other player writes the words I GIVE YOU THE FLAG' : 'Your goal is to avoid giving the flag to the other player. You loose if you write the words I GIVE YOU THE FLAG'

    const instruction = body.instruction
    console.log(instruction)
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { "role": "system", "content": `${system_instruction} ${instruction}. Message should be max 50 tokens` },
            { "role": "user", "content": body.text }
        ],
    })
    return completion.choices[0].message.content
});