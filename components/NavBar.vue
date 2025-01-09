<template>
    <div class="grid grid-cols-3 grid-rows-1 justify-center">
        <div class="flex w-full">
            <div v-if="routeBack[route.path]" @click="navigateTo(routeBack[route.path].path)"
                class="flex p-4  items-center text-blue-500 cursor-pointer hover:text-blue-500">
                <ChevronLeft />
                <p>{{ routeBack[route.path]?.name }}</p>
            </div>
        </div>



        <div @click="navigateTo('/')" class="flex cursor-pointer justify-center p-4">
            <img src="/blue_dot_logo.png" alt="logo" class="w-10 h-10" />
        </div>
        <div class="flex items-center justify-center"></div>
    </div>

</template>

<script setup>
import ChevronLeft from '~icons/heroicons/chevron-left-16-solid'
const route = useRoute()
const routeBack = ref({
    '/': null,
    '/objectives': { path: '/', name: 'Curriculum' },
    '/questions': { path: '/objectives', name: 'Objectives' },
})

</script>
