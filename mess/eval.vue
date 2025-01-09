<template>
    <div class="grid grid-rows-[auto,1fr]">
        <div class="pt-8"><img src="/blue_dot_logo.png" alt="logo" class="w-10 h-10 mx-auto" /></div>
        <div class="grid grid-cols-1 grid-rows-[auto,auto,1fr,auto,auto] h-full w-screen p-8">
            <input v-model="url" class="w-full bg-gray-100 rounded-md resize-none outline-none p-2" />
            <button @click="scrapeUrl(url)"
                class="bg-stone-900 text-sm mb-4 hover:bg-stone-800 mt-2 rounded-md p-2 text-white">Scrape</button>
            <div class="text-xs flex flex-wrap custom-container overflow-scroll" ref="contentContainer">
                <p :ref="el => (itemRefs[idx] = el)"
                    :class="[idx > start && idx < end ? 'bg-orange-100 font-bold' : '']"
                    v-for="(word, idx) in content.split(' ')" class="pr-1">{{ word }}
                </p>
            </div>
            <div class="mt-4 mb-4 flex flex-col gap-2 overflow-scroll h-[200px]">
                <div @mouseover="highlightSource(objective)" v-for="objective in objectives"
                    class="flex hover:bg-gray-200 cursor-pointer  p-2 text-sm rounded-md w-full bg-gray-100 justify-between">
                    <span>{{ objective.text }}</span>
                </div>
            </div>
            <button @click="detectObjectives(url)"
                class="bg-stone-900 text-sm mb-4 hover:bg-stone-800 mt-2 rounded-md p-2 text-white">Get
                Objectives</button>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const url = ref('https://aisafetyfundamentals.com/blog/why-are-people-building-ai-systems/?_gl=1*7vc0lk*_ga*NDEyOTk5OTM4LjE3MjQ0MjI4MjQ.*_ga_8W59C8ZY6T*MTczNjAwMzIxOC4zNi4xLjE3MzYwMDMyMzMuMC4wLjA.');
const content = ref('');
const contentContainer = ref(null);

const scrapeUrl = async (url) => {
    const response = await $fetch('/api/scrapeUrl', {
        method: 'POST',
        body: {
            url: url
        }
    });
    content.value = response.replace(/\s+/g, ' ');

    console.log(content.value);
};
const itemRefs = ref([]);

const start = ref(0);
const end = ref(4);

const highlightSource = async (objective) => {
    const scope = objective.source.split('-');
    console.log(scope);
    start.value = parseInt(scope[0]);
    end.value = parseInt(scope[1]);
    console.log(start.value, end.value);

    await nextTick();
    const element = itemRefs.value[start.value];
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const objectives = ref([]);

const detectObjectives = async () => {
    const response = await $fetch('/api/detect_objectives_from_text', {
        method: 'POST',
        body: {
            text: content.value
        }
    });
    objectives.value = response.objectives;
};
</script>
