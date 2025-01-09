<template>
    <Transition appear name="list">
        <div class="grid overflow-hidden mx-auto max-w-[800px] p-4 grid-rows-[1fr,auto] w-screen">

            <div class="flex  h-full flex-col gap-2">

                <div class="flex h-full flex-col gap-2 justify-center">

                    <div class="flex mb-4 gap-2 items-center">


                        <h1 class="text-2xl mx-auto text-gray-500">Specify Learning Objectives</h1>
                    </div>
                    <h2 class="text-gray-500 mt-4">Learning Objectives</h2>
                    <div ref="obj_container"
                        class="flex gap-2 flex-col custom-container overflow-scroll  text-sm rounded-md w-fulljustify-between">
                        <div v-if="objectives.length" class="flex flex-col gap-2 w-full justify-center">
                            <div v-if="objectives" v-for="objective, idx in objectives"
                                class="flex p-2 gap-4 text-sm rounded-md w-full bg-gray-100 justify-between">
                                <textarea v-model="objective.text"
                                    class="w-full outline-none resize-none field bg-transparent"></textarea>
                                <!-- <input class="outline-none" :checked="objective.passed" type="checkbox" /> -->
                                <div @click="removeObjective(idx)"
                                    class="flex items-center text-xs text-gray-500 cursor-pointer hover:text-red-500">
                                    <Trash />
                                </div>
                            </div>

                        </div>
                        <div class="w-full text-center text-gray-500 h-full justify-center flex items-center" v-else>
                            There are
                            currently
                            no objectives defined.<br>Add some below!
                        </div>

                        <div v-if="pending" class="flex items-center flex-col gap-2 w-full justify-center">
                            <div v-for="i in 5"
                                class="flex p-1 text-sm rounded-md h-8 animate-pulse w-full bg-gray-100  justify-between">
                            </div>
                            <img src="/blue_dot_logo.png" alt="logo" class="w-6 h-6 mt-4 flex animate-spin" />
                        </div>

                    </div>

                    <div class="relative">
                        <input type="text" @keydown.enter="addObjective" v-model="new_objective"
                            placeholder="Input a new learning objective (Press ENTER to add)"
                            class="bg-gray-100 outline-none resize-none rounded-md p-2 w-full" rows="8" />
                    </div>


                    <button @click="detectObjectives"
                        class=" text-sm flex items-center border border-blue-500 p-2 gap-2 justify-center  text-blue-500  hover:bg-blue-100 rounded-md w-full">
                        Generate from Source
                        <Sparkles />
                    </button>
                    <button @click="navigateTo('/questions')"
                        :class="[objectives?.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 pointer-events-none']"
                        class="bg-blue-500 text-sm flex items-center p-2 gap-2 justify-center hover:bg-blue-400 rounded-md w-full">
                        Continue

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

const new_objective = ref('')
const objectives = useState('objectives', () => [])

const pending = ref(false)
const resources = useState('resources')

const obj_container = ref(null)

const addObjective = async () => {

    objectives.value.push({ text: new_objective.value })
    new_objective.value = ''
    await nextTick()
    obj_container.value.scrollTop = obj_container.value.scrollHeight;
}

const detectObjectives = async () => {

    pending.value = true
    const response = await $fetch('/api/detect_objectives_from_text', {
        method: 'POST',
        body: {
            text: resources.value[0].text
        }
    })
    pending.value = false
    objectives.value.push(...response.objectives.map(obj => ({ ...obj, passed: false })))
}


const removeObjective = (index) => {
    objectives.value.splice(index, 1)
}

</script>
