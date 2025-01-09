<template>
    <!-- Transition component for smooth appearance of the main container -->
    <Transition appear name="list">

        <div
            class="grid mx-auto max-w-[800px] grid-rows-[1fr,auto] overflow-hidden justify-center items-center p-4 w-screen">
            <!-- Logo section -->

            <!-- Main content section -->
            <div class="w-screen justify-center p-4 mx-auto h-full flex-col gap-2 max-w-[800px] flex">
                <!-- Progress and Skip button section -->
                <div class="flex text-sm text-gray-500 rounded-md gap-4 w-full justify-between items-center">
                    <div class="flex flex-wrap items-center gap-4 rounded-md">
                        Questions:
                        <!-- Objective selection buttons -->
                        <div v-for="(question, index) in questions" :key="index" @click="selectObjective(index)"
                            :class="[question.passed ? 'bg-green-100 border-green-500 text-green-500' : 'text-blue-500 border-blue-500', q_index == index ? 'border border-blue-500' : '']"
                            class="flex p-1 items-center w-6 cursor-pointer h-6 justify-center aspect-square rounded-full bg-blue-100 flex-col">
                            {{ index + 1 }}
                        </div>
                    </div>
                    <!-- Skip Objective button -->
                    <!-- <button @click="skipObjective"
                        class="bg-red-100 p-2 hover:bg-red-200 rounded-md text-sm text-red-500">Skip Objective</button> -->
                    <button @click="exitTest"
                        class="bg-red-100 p-2 hover:bg-red-200 rounded-md text-sm text-red-500">Exit Test</button>
                </div>

                <!-- Conversation section -->
                <TransitionGroup name="list">
                    <h1 class="text-2xl text-gray-500">Question</h1>
                    <div v-if="!objectives?.length"
                        class="custom-container text-gray-500 text-sm flex justify-center items-center">There are
                        currently
                        no objectives defined</div>
                    <div v-else ref="chat"
                        class="flex -mr-2 pr-2 overflow-scroll custom-container flex-col h-full gap-2">
                        <div class="flex flex-col gap-2">
                            <!-- Message display -->
                            <div class="flex flex-col" v-for="(message, idx) in conversation" :key="idx">
                                <!-- System message -->
                                <div v-if="message.role == 'system'" class="w-fit mr-20 flex flex-col gap-4">
                                    <div v-if="message.type == 'question'" class="bg-gray-100 p-2 w-auto rounded-md">{{
                                        message.text }}</div>
                                    <Hint v-if="message.type == 'hint'" :text="message.text" :pending="pending" />

                                </div>
                                <!-- Passed message -->
                                <div v-else-if="message.role == 'end'" class="w-fit mr-20 flex flex-col gap-4">
                                    <div class="bg-green-100 text-green p-2 w-auto rounded-md">{{
                                        message.text }}
                                    </div>



                                </div>

                                <!-- User message -->
                                <div v-else class="bg-blue-100 p-2 w-auto ml-20 rounded-md self-end">{{ message.text }}
                                </div>

                            </div>
                        </div>

                        <Tools v-if="conversation[conversation.length - 1]?.role == 'system' && !pending"
                            :getHint="getHint" />
                        <Loading v-if="pending" :msg="pending_states?.[pending]?.msg" />
                    </div>

                </TransitionGroup>
            </div>

            <!-- Answer input section -->
            <div class="flex p-4 flex-col h-full w-full gap-2">
                <h1>Your answer</h1>
                <div class="bg-gray-100 border h-full flex-col w-full rounded-md flex">
                    <textarea @keydown.enter="(e) => submitAnswer(e)" v-model="user_response"
                        placeholder="Answer the question to the best of your knowledge"
                        class="bg-gray-100 outline-none text-sm resize-none rounded-md p-2 h-full w-full" type="text">
                    </textarea>
                    <div class="flex m-2 justify-end">
                        <button @click="submitAnswer"
                            class="w-fit text-gray-500 hover:text-stone-900 hover:bg-gray-200 rounded-md text-sm p-2">Submit</button>
                    </div>

                </div>
            </div>


        </div>
    </Transition>
</template>

<script setup>
import Hint from '~/components/Hint.vue'
import Loading from '~/components/Loading.vue'
import Tools from '~/components/Tools.vue'

const q_a = useState('q_a')
const questions = ref(null)
// flatten nested q_a array
questions.value = q_a?.value?.flat()


// State variables
const conversation = ref([]) // Holds the conversation messages
const objectives = useState('objectives') // Objectives state
const chat = ref(null) // Reference to the chat container
const user_response = ref('') // User's response
const page = ref('start') // Current page state
const q_index = ref(0) // Current objective index
const pending = ref(null)

const pending_states = ref({
    hint:
        { status: false, msg: 'Fetching a Hint' },
    question:
        { status: false, msg: 'Generating Question' },
    system:
        { status: false, msg: 'Thinking...' }
}


) // Pending state for system messages
const resources = useState('resources') // Resources state

// Function to select an objective
const selectObjective = (index) => {
    q_index.value = index
    conversation.value = []
    askQuestion()
}

// Function to start evaluation
const startEval = async () => {
    if (!objectives.value.length) {
        return
    }
    askQuestion()

}

const setPending = (name) => {
    pending.value = name
}

const endPending = () => {
    pending.value = null
}

const exitTest = () => {
    conversation.value = []
    navigateTo('/questions')
}

// Function to skip the current objective
const skipObjective = () => {
    conversation.value = []
    q_index.value++
    if (q_index.value < objectives.value.length) {
        askQuestion()
    } else {
        page.value = 'start'
    }
}

// Function to get a hint
const getHint = async () => {
    setPending('hint')
    const response = await $fetch('/api/hint', {
        method: 'POST',
        body: {
            question: questions.value[q_index.value].question,
            prev_hints: conversation.value.filter(msg => msg.type == 'hint')?.map(msg => msg.text),
            answer: questions.value[q_index.value].answer
        }
    })

    conversation.value.push({ role: 'system', text: response, type: 'hint' })
    endPending()
}



// Function to ask a question
const askQuestion = async () => {
    setPending('question')
    setTimeout(() => {
        conversation.value.push({ role: 'system', text: questions.value[q_index.value].question, type: 'question' })
        endPending()
    }, 1000)

}

// Function to submit an answer
const submitAnswer = async (e) => {
    e.preventDefault()
    conversation.value.push({ role: 'user', text: user_response.value })
    user_response.value = ''
    setPending('system')
    const response = await $fetch('/api/evaluate', {
        method: 'POST',
        body: {
            question: questions.value[q_index.value].question,
            answer: questions.value[q_index.value].answer,
            conversation: conversation.value
                ?.map(entry => {
                    const role = entry.role.toUpperCase();
                    const text = entry.text;
                    return `${role}: ${text}`;
                })
                .join('\n')
        }
    })
    endPending()
    if (response == 'Passed!') {
        conversation.value.push({ role: 'end', type: 'pass', text: response })
    } else {
        conversation.value.push({ role: 'system', type: 'question', text: response })
    }

    setTimeout(() => {
        if (response == 'Passed!') {
            conversation.value = []
            questions.value[q_index.value].passed = true
            q_index.value++
            if (q_index.value < questions.value.length) {
                askQuestion()
            } else {
                navigateTo('/questions')
            }
        }
    }, 1000)
}

// Watcher to scroll the chat to the bottom when new messages are added
watch(conversation, async () => {
    await nextTick()
    chat.value.scrollTop = chat.value.scrollHeight
}, { deep: true })

// On component mount, start the evaluation
onMounted(() => {
    startEval()
})
</script>
