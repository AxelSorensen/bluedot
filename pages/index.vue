<template>
    <Transition appear name="list">
        <div
            class="grid mx-auto  max-w-[800px] grid-rows-[auto,2fr,200px]  justify-center items-center w-screen h-screen">

            <div class="pt-8"><img src="/blue_dot_logo.png" alt="logo" class="w-10 h-10 mx-auto" /></div>


            <div class="w-screen p-4 mx-auto h-full flex-col gap-2 max-w-[800px]  flex">
                <div v-if="page == 'eval'" class="flex text-sm text-gray-500 mt-4 pl-4 rounded-md gap-4  items-center">
                    Progress:
                    <div class="flex p-2 gap-4 rounded-md">

                        <div :class="[objective.passed ? 'bg-green-100 text-green-600' : 'text-blue-500', obj_index == index ? 'border border-blue-500' : '']"
                            class="flex p-1 items-center w-6 h-6 justify-center aspect-square rounded-full bg-blue-100 flex-col"
                            v-for="objective, index in objectives">

                            {{ index
                                + 1 }}

                        </div>
                    </div>
                </div>
                <TransitionGroup name="list">
                    <div v-if="page == 'start'" class="flex w-full flex-col justify-center items-center gap-2">
                        <div class="flex mb-4 gap-2 items-center">
                            <h1 class="text-2xl text-gray-500">What are your learning objectives?</h1>
                        </div>

                        <textarea placeholder="Input learning objectives" v-model="learning_objective_text"
                            class="bg-gray-100 outline-none resize-none rounded-md p-2 w-full" rows="8"
                            type="text"></textarea>
                        <button class="bg-blue-500 text-white hover:bg-blue-400  rounded-md p-2 w-full"
                            @click="detectObjectives">
                            Detect Objectives
                        </button>
                    </div>
                    <div v-else-if="page == 'objectives'" class="flex   flex-col gap-2 items-center justify-center">
                        <h1>Learning Objectives</h1>
                        <div v-if="!objectives.length" v-for="i in 5"
                            class="flex p-1 text-sm rounded-md h-8 animate-pulse w-full bg-gray-100 max-w-[600px] justify-between">




                        </div>
                        <div v-for="objective in objectives"
                            class="flex p-2 text-sm rounded-md w-full bg-gray-100 max-w-[600px] justify-between">
                            <p>{{ objective.text }}</p>
                            <input class="outline-none" :checked="objective.passed" type="checkbox" />
                        </div>

                        <button v-if="objectives.length" @click="startEval"
                            class="bg-blue-500 hover:bg-blue-400 text-white max-w-[600px]  rounded-md p-2 w-full">Begin
                            Evaluation</button>


                    </div>

                    <div v-else-if="page == 'eval'" class="flex  p-4 flex-col h-full w-full gap-2">



                        <h1 class="text-2xl mb-4 text-gray-500">Question time</h1>
                        <!-- <button @click="askQuestion"
                            class="bg-blue-100 hover:bg-blue-200 w-full p-2 text-blue-500 rounded-md">Ask
                            Question</button> -->

                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col" v-for="message in conversation">
                                <div v-if="message.role == 'system'"
                                    :class="[message.text == 'Passed!' ? 'bg-green-100' : 'bg-gray-100']"
                                    class="p-2 w-fit rounded-md self-start">{{
                                        message.text
                                    }}</div>
                                <div v-else class="bg-blue-100 p-2 w-auto rounded-md self-end">{{
                                    message.text
                                    }}</div>
                            </div>
                        </div>
                        <div v-if="system_question"
                            class="flex mr-20 bg-gray-100 rounded-md   p-4 flex-col h-auto gap-2">
                            <p class="text-sm">{{ system_question }}</p>
                        </div>

                    </div>
                </TransitionGroup>



            </div>


            <div v-if="page == 'eval'" class="flex  p-4 flex-col h-full w-full gap-2">
                <h1>Your answer</h1>
                <div class="bg-gray-100 border h-full flex-col w-full rounded-md flex">

                    <textarea v-model="user_response" placeholder="Answer the question to the best of your knowledge"
                        class="bg-gray-100 outline-none text-sm resize-none rounded-md p-2 h-full w-full"
                        type=" text"></textarea>
                    <div class="flex justify-end">
                        <button @click="submitAnswer"
                            class="w-fit text-gray-500 hover:text-stone-900  hover:bg-gray-200 rounded-md text-sm p-2">Submit</button>
                    </div>
                </div>
            </div>


        </div>
    </Transition>


</template>

<script setup>
import ChevronLeft from '~icons/heroicons/chevron-left-16-solid'
const conversation = ref([])
const learning_objective_text = ref('')
const objectives = ref([])
const question = ref('')
const user_response = ref('')
const page = ref('start')
const obj_index = ref(0)
const startEval = async () => {
    page.value = 'eval'
    askQuestion()
}

const detectObjectives = async () => {
    page.value = 'objectives'
    const response = await $fetch('/api/detect_objectives', {
        method: 'POST',
        body: {
            text: learning_objective_text.value
        }
    })
    objectives.value = response.objectives.map(obj => ({ text: obj, passed: false }))
}

const askQuestion = async () => {
    const response = await $fetch('/api/question', {
        method: 'POST',
        body: {
            text: objectives.value[obj_index.value].text
        }
    })
    conversation.value.push({ role: 'system', text: response })
}

const submitAnswer = async () => {
    conversation.value.push({ role: 'user', text: user_response.value })
    user_response.value = ''
    const response = await $fetch('/api/evaluate', {
        method: 'POST',
        body: {
            objective: objectives.value[obj_index.value].text,
            question: conversation.value[conversation.value.length - 2].text,
            answer: conversation.value[conversation.value.length - 1].text
        }
    })
    conversation.value.push({ role: 'system', text: response })
    setTimeout(() => {
        if (response == 'Passed!') {
            conversation.value = []
            objectives.value[obj_index.value].passed = true
            obj_index.value++
            if (obj_index.value < objectives.value.length) {
                askQuestion()
            } else {
                page.value = 'start'
            }
        }
    }, 1000)

}

</script>
