<template>
    <div class="flex gap-2">

        <button @click="getHint"
            class="p-2 flex text-sm items-center gap-2 hover:bg-gray-200 bg-gray-100 text-gray-500 w-fit rounded-md">Hint
            <LightBulb class="text-gray-400" />
        </button>
        <!-- <button @click="getExample"
            class="p-2 flex text-sm items-center gap-2 hover:bg-gray-200 bg-gray-100 text-gray-500 w-fit rounded-md">Example
            <Question class="text-gray-400" />
        </button>
        <button
            class="p-2 text-sm flex items-center hover:bg-gray-200 gap-2 bg-gray-100 text-gray-500 w-fit rounded-md">Solution
            <CheckMark class="text-gray-400" />
        </button>
        <button
            class="p-2 text-sm flex items-center hover:bg-gray-200 gap-2 bg-gray-100 text-gray-500 w-fit rounded-md">Sources
            <Book class="text-gray-400 text-base" />
        </button> -->
    </div>
</template>

<script setup>
import Question from '~icons/heroicons/question-mark-circle-16-solid'
import CheckMark from '~icons/heroicons/check-circle-16-solid'
import LightBulb from '~icons/heroicons/light-bulb-16-solid'
import Book from '~icons/heroicons/book-open-16-solid'

// define props function coming from parent
defineProps({
    getHint: Function,
    getExample: Function,
    getSolution: Function,
    getSources: Function
})

</script>
