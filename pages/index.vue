<template>
    <!-- Transition component for smooth appearance of the content -->
    <Transition appear name="list">
        <div class="grid overflow-hidden mx-auto max-w-[800px] p-4 grid-rows-[1fr,auto] w-screen">
            <!-- Logo section -->

            <!-- Main content section -->
            <div v-if="page == 'start'" class="flex h-full flex-col gap-2">
                <!-- Header section -->
                <div class="flex mb-4 gap-2 items-center">
                    <h1 class="text-2xl mx-auto text-gray-500">Add your curriculum</h1>
                </div>
                <!-- Input field for resource URL -->
                <input @input="clearResources" placeholder="Input resource url" v-model="resource_url"
                    class="bg-gray-100 outline-none resize-none rounded-md p-2 w-full" rows="8" type="text" />
                <!-- Extract information button -->
                <button v-if="!resources?.length && !pending"
                    class="bg-blue-500 text-white hover:bg-blue-400 rounded-md p-2 w-full"
                    @click="scrapeUrl(resource_url)">
                    Extract information
                </button>
                <div v-if="error" class="text-sm text-red-500 text-center">ERROR: Could not scrape url</div>
                <!-- Loading animation while scraping -->
                <div class="flex items-center flex-col gap-2 w-full justify-center" v-if="pending && !resources.length">
                    <div v-for="i in 5"
                        class="flex p-1 text-sm rounded-md h-8 animate-pulse w-full bg-gray-100 justify-between">
                    </div>
                    <img src="/blue_dot_logo.png" alt="logo" class="w-6 h-6 mt-4 flex animate-spin" />
                </div>
                <!-- Display scraped resources -->
                <div class="h-full flex flex-col" v-else>
                    <div class="text-xs text-gray-500 custom-container overflow-scroll" v-for="resource in resources">
                        <textarea class="w-full h-full resize-none outline-none" v-model="resource.text"></textarea>
                    </div>
                </div>
            </div>
            <!-- Continue button to navigate to the next page -->
            <div v-if="resources.length" class="mt-4">
                <button v-if="page == 'start'" @click="navigateTo('/objectives')"
                    class="bg-blue-500 text-white hover:bg-blue-400 rounded-md p-2 w-full">
                    Continue
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import Sparkles from '~icons/heroicons/sparkles-16-solid'

// State variables
const page = ref('start')
const pending = ref(false)
const resources = useState('resources', () => [])
const objectives = useState('objectives')
const q_a = useState('q_a')
const resource_url = ref('https://aisafetyfundamentals.com/blog/what-is-ai-alignment/?_gl=1*wj273g*_ga*NDEyOTk5OTM4LjE3MjQ0MjI4MjQ.*_ga_8W59C8ZY6T*MTczNjAxODkwOS4zOC4wLjE3MzYwMTg5MDkuMC4wLjA.')
const error = ref(null)
const clearResources = () => {

    if (error.value) {
        error.value = null
    }
    if (resources.value.length) {
        resources.value = []
    }
    if (objectives.value.length) {
        objectives.value = []
    }
    if (q_a?.value?.length) {
        q_a.value = []
    }


}

// Function to scrape URL and extract information
const scrapeUrl = async (url) => {

    error.value = null
    pending.value = true

    setTimeout(async () => {
        try {
            const response = await $fetch('/api/scrapeUrl', {
                method: 'POST',
                body: {
                    url: url
                }
            });
            pending.value = false
            resources.value.push({ url: url, text: response.replace(/\s+/g, ' ') })
        } catch (err) {
            error.value = err
            pending.value = false
        }
    }, 1000)

    // Simulate delay for loading animation

    // Simulate delay for loading animation
};
</script>
