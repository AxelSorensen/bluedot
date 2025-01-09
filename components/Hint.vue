<template>
    <div>

        <div class="bg-orange-100 gap-1 flex  text-sm p-2 rounded-md">
            <div class="text-orange-300">
                <LightBulb />
            </div>{{ text }}
        </div>
    </div>
</template>

<script setup>
import LightBulb from '~icons/heroicons/light-bulb-16-solid'
defineProps({
    text: String,
    pending: Boolean
})

</script>
