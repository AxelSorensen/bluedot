<template>
    <Transition appear name="list">
        <div class="grid mx-auto grid-rows-[auto,2fr,1fr]  justify-center items-center w-screen h-screen">

            <!-- <div class="pt-8"><img src="/blue_dot_logo.png" alt="logo" class="w-10 h-10 mx-auto" /></div> -->
            <div class="flex p-4 text-gray-500 justify-center items-center gap-2">
                <h1 class="text-2xl">Capture the Flag</h1>
                <Flag class="text-2xl" />
            </div>
            <div class="w-full flex h-full  gap-2 flex-col p-4">
                <div class="bg-gray-100 rounded-md h-full">
                    <div class="flex gap-2 items-center w-full h-full flex-col">
                        <h2 class="text-gray-400 pt-2">Conversation</h2>
                        <div ref="convo"
                            class="flex scroll-smooth flex-col overflow-scroll custom-container gap-2 w-full h-full p-2">
                            <div v-for="msg in conversation" class="flex gap-2">
                                <div v-if="msg.player == 1" class="bg-blue-100 p-2 mr-20 rounded-md self-start">
                                    {{ msg.text }}
                                </div>
                                <div v-else-if="msg.player == 2" class="bg-red-100 p-2 ml-20 rounded-md self-end">
                                    {{ msg.text }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="game_state == 'start'" class="text-center text-gray-500">Ready to play?</div>
                <div v-if="game_state == 'prompt'" class="text-center text-gray-500">Player {{ current_player }}'s
                    turn. Want
                    to add anything to your instructions?</div>
                <button v-if="game_state == 'start'" @click="startGame"
                    class="bg-gray-100 hover:bg-gray-200 rounded-md w-full p-2">Start</button>
                <button
                    :class="[current_player == 1 ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-red-100 hover:bg-red-200 text-red-700']"
                    class="  rounded-md w-full p-2" v-if="game_state == 'prompt'"
                    @click="generateResponse">Continue</button>

            </div>
            <div class="w-screen  p-4 mx-auto h-full flex gap-2 justify-center">
                <div class="flex  gap-2 items-center w-full h-full flex-col">
                    <h2 class="text-blue-500">Player 1</h2>
                    <textarea v-model="player_1_instructions" placeholder="Type your instructions"
                        class="bg-gray-100 h-full p-2 w-full rounded-md" type="text"></textarea>
                </div>
                <div class="flex gap-2 items-center w-full h-full flex-col">
                    <h2 class="text-red-500">Player 2</h2>
                    <textarea v-model="player_2_instructions" placeholder="Type your instructions"
                        class="bg-gray-100 h-full p-2 w-full rounded-md" type="text"></textarea>
                </div>

            </div>


        </div>
    </Transition>


</template>


<script setup>
import Flag from '~icons/heroicons/flag-16-solid'
const game_state = ref('start')
const player_1_instructions = ref('')
const player_2_instructions = ref('')
const current_player = ref(1)
const conversation = ref([{ player: null, text: 'Start convincing the other player to give you the flag' }])
const convo = ref(null)
const generateResponse = async () => {
    const response = await $fetch('/api/response', {
        method: 'POST',
        body: {
            player: current_player.value,
            instruction: current_player.value == 1 ? player_1_instructions.value : player_2_instructions.value,
            text: conversation.value[conversation.value.length - 1].text
        }
    })

    conversation.value.push({
        player: current_player.value,
        text: response,
    })

    nextTick(() => {
        const convoDiv = convo.value
        convoDiv.scrollTop = convoDiv.scrollHeight
    })

    if (current_player.value == 1) {
        current_player.value = 2
    } else {
        current_player.value = 1
    }
    game_state.value = 'prompt'

}

const startGame = () => {
    generateResponse()
}


</script>
