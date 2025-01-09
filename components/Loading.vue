<template>
    <div class=" items-center flex gap-2 pl-[1px] pt-2">

        <img src="/blue_dot_logo.png" alt="logo" class="w-5 h-5 animate-spin" />
        <div class="text-sm  text-gray-500">{{ msg }}</div>

    </div>
</template>

<script setup>
defineProps({
    msg: String
})

</script>