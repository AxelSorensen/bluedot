<template>
    <Transition appear name="list">
        <div
            class="grid mx-auto  max-w-[800px] grid-rows-[auto,1fr,1fr]  justify-center items-center w-screen h-screen">

            <div class="pt-8"><img src="/blue_dot_logo.png" alt="logo" class="w-10 h-10 mx-auto" /></div>


            <div class="w-screen p-4 mx-auto h-full flex-col gap-2 max-w-[800px] justify-center  flex">

                <img :src="param_imgs[img_index]" alt="logo" class="w-40 h-40 mx-auto" />
                <input v-model="img_index" type="range" min="0" max="3">
            </div>
            <div class="flex flex-col gap-4">
                <img :src="timeline_imgs[timeline_index]" alt="logo" class="w-40 h-40 mx-auto" />

                <div class="flex gap-2 justify-center">
                    <button @click="guessYear(img.split('/').pop().split('.')[0])"
                        class="bg-gray-100 p-2 hover:bg-gray-200 rounded-md" v-for="img in timeline_imgs">
                        {{ img.split('/').pop().split('.')[0] }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>


</template>

<script setup>
import img1 from 'assets/images/350m.png'
import img2 from 'assets/images/750m.png'
import img3 from 'assets/images/3b.png'
import img4 from 'assets/images/20b.png'
import img5 from 'assets/images/2014.png'
import img6 from 'assets/images/2015.png'
import img7 from 'assets/images/2016.png'
import img8 from 'assets/images/2017.png'
import img9 from 'assets/images/2018.png'
import img10 from 'assets/images/2019.png'
import img11 from 'assets/images/2020.png'
import img12 from 'assets/images/2021.png'
import img13 from 'assets/images/2022.png'

const timeline_index = ref(0)

const param_imgs = [
    img1,
    img2,
    img3,
    img4
]
const timeline_imgs = [
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13
]

const guessYear = (year) => {
    if (year == timeline_imgs[timeline_index.value].split('/').pop().split('.')[0]) {
        timeline_index.value++
    }

}
import ChevronLeft from '~icons/heroicons/chevron-left-16-solid'
const conversation = ref([])
const img_index = ref(0)
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
    objectives.value = response.objectives?.map(obj => ({ text: obj, passed: false }))
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
