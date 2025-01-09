<template>
    <Transition appear name="list">
        <div class="grid overflow-hidden mx-auto max-w-[800px] p-4 grid-rows-[1fr,auto] w-screen">
            <div class="flex  h-full flex-col gap-2">
                <div class="flex mb-4 gap-2 items-center">

                    <h1 class="text-2xl mx-auto text-gray-500">Specify Questions and Answers</h1>
                </div>
                <div class="flex h-full flex-col gap-2 justify-center">

                    <div class="flex items-center gap-4 rounded-md">
                        <h2 class="text-gray-500">Objective:</h2>
                        <!-- Objective selection buttons -->
                        <div v-for="(objective, index) in objectives" :key="index" @click="selectObjective(index)"
                            :class="[objective.passed ? 'bg-green-100 border-green-500 text-green-500' : 'text-blue-500 border-blue-500', obj_index == index ? 'border border-blue-500' : '']"
                            class="flex p-1 items-center w-6 cursor-pointer h-6 justify-center aspect-square rounded-full bg-blue-100 flex-col">
                            {{ index + 1 }}
                        </div>
                    </div>

                    <div class="flex gap-2 mt-2  flex-col h-full  text-sm w-full">
                        <div class="bg-blue-100 text-blue-500 rounded-md p-2 items-center flex gap-2">
                            <div class="p-2">
                                <Cap class="text-lg" />
                            </div>
                            <h2 class=" text-base"><b>Objective:</b> {{ objectives?.[obj_index]?.text }}</h2>
                        </div>
                        <div v-if="pending" class="flex h-full items-center flex-col gap-2 w-full">
                            <div v-for="i in 5"
                                class="flex p-1 text-sm rounded-md h-8 animate-pulse w-full bg-gray-100  justify-between">
                            </div>
                            <img src="/blue_dot_logo.png" alt="logo" class="w-6 h-6 mt-4 flex animate-spin" />
                        </div>
                        <div v-else-if="!q_a?.[obj_index]?.length"
                            class="w-full text-center text-gray-500 h-full justify-center flex items-center">
                            There are
                            currently
                            no questions defined for this objective.<br>Add some below!
                        </div>
                        <div v-else ref="obj_container"
                            class="flex gap-2 flex-col custom-container overflow-scroll   text-sm rounded-md w-full">
                            <div class="flex flex-col gap-2" v-for="item, idx in q_a?.[obj_index]">
                                <div v-if="!item.question">
                                </div>
                                <div class="flex w-full justify-between  gap-2">
                                    <details class="bg-gray-100 w-full rounded-md">
                                        <summary
                                            class="cursor-pointer sticky top-0 bg-gray-100 rounded-md p-2 hover:bg-gray-200">
                                            Question {{
                                                idx + 1
                                            }}: <span class="text-gray-500">{{ item.question
                                                }}</span>
                                        </summary>
                                        <div class="pt-4 p-2 flex flex-col gap-2">
                                            <div class="flex flex-col gap-2">
                                                <h2 class="font-medium">Question</h2>
                                                <textarea v-model="q_a[obj_index][idx].question"
                                                    class="w-full outline-none resize-none field bg-white rounded-md p-2"></textarea>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <h2 class="font-medium">Answer</h2>
                                                <textarea v-model="q_a[obj_index][idx].answer"
                                                    class="w-full outline-none resize-none field bg-white rounded-md p-2"></textarea>
                                            </div>
                                        </div>
                                    </details>
                                    <div @click="removeQuestion(idx)"
                                        class="flex items-center rounded-md text-xs bg-gray-100 p-2 text-gray-500 cursor-pointer hover:text-red-500">
                                        <Trash />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>


                    <!-- <div ref="obj_container"
                        class="flex gap-2 flex-col custom-container overflow-scroll  text-sm rounded-md w-full justify-between">
                        <div class="flex flex-col gap-2 w-full justify-center">

                            <div v-for="objective, obj_idx in objectives"
                                class="flex flex-col text-sm rounded-md w-full  justify-between">
                                <h2 class="">{{ objective.text }}</h2>
                                <details class="  rounded-md text-blue-500" v-for="item in q_a[obj_idx]">
                                    <summary class="bg-blue-100 rounded-md p-2">{{ item.question }}</summary>
                                    <p class="p-2 bg-blue-50"><b>Answer:</b> {{ item.answer }}</p>
                                </details>

                            </div>

                        </div>

                        <div v-if="pending" class="flex items-center flex-col gap-2 w-full justify-center">
                            <div v-for="i in 5"
                                class="flex p-1 text-sm rounded-md h-8 animate-pulse w-full bg-gray-100  justify-between">
                            </div>
                            <img src="/blue_dot_logo.png" alt="logo" class="w-6 h-6 mt-4 flex animate-spin" />
                        </div>

                    </div> -->

                    <div class="relative">
                        <input type="text" @keydown.enter="addQuestion" v-model="new_question"
                            placeholder="Add a new question (Press ENTER to add)"
                            class="bg-gray-100 outline-none resize-none rounded-md p-2 w-full" rows="8" />
                    </div>

                    <div class="flex gap-2">

                        <button @click="generateQuestions"
                            class=" text-sm flex items-center border border-blue-500 p-2 gap-2 justify-center  text-blue-500  hover:bg-blue-100 rounded-md w-full">
                            Generate {{ num_questions }} based on Objectives
                            <Sparkles />
                        </button>
                        <div class="flex gap-2">
                            <input type="number" v-model="num_questions"
                                class="bg-gray-100 outline-none w-20 resize-none rounded-md p-2" />
                        </div>
                    </div>
                    <button @click="navigateTo('play')"
                        :class="[objectives?.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 pointer-events-none']"
                        class="bg-blue-500 text-sm flex items-center p-2 gap-2 justify-center hover:bg-blue-400 rounded-md w-full">
                        Play

                    </button>


                </div>
            </div>

            <div v-if="resources?.length" class="mt-4">
                <button v-if="page == 'start'" @click="page = 'objectives'"
                    class="bg-blue-500 text-white hover:bg-blue-400 rounded-md p-2 w-full">
                    Continue
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import Sparkles from '~icons/heroicons/sparkles-16-solid'
import Trash from '~icons/heroicons/trash-16-solid'
import ChevronLeft from '~icons/heroicons/chevron-left-16-solid'
import Cap from '~icons/heroicons/academic-cap-16-solid'

const new_question = ref('')
const objectives = useState('objectives')

const q_a = useState('q_a', () => objectives.value?.map(() => []))
const pending = ref(false)
const resources = useState('resources')

const obj_container = ref(null)

const addQuestion = async () => {

    q_a.value[obj_index.value].push({ question: new_question.value, answer: '' })
    new_question.value = ''
    await nextTick()
    obj_container.value.scrollTop = obj_container.value.scrollHeight;
}

const obj_index = ref(0)

const selectObjective = (index) => {
    obj_index.value = index
}

const num_questions = ref(3)

const generateQuestions = async () => {
    pending.value = true
    const response = await $fetch('/api/question', {
        method: 'POST',
        body: {
            objectives: objectives.value.map(obj => obj.text),
            resource: resources.value?.[0]?.text,
            num_questions: num_questions.value
        }
    })
    pending.value = false
    q_a.value[obj_index.value].push(...response.q_a)
}


const removeQuestion = (index) => {
    q_a.value[obj_index.value].splice(index, 1)
}

</script>
