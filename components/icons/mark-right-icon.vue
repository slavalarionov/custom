<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        color?: string
    }>(),
    {
        color: '#9399A1'
    }
)
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 20 26"
    >
        <path
            d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
            :fill="props.color"
        />
    </svg>
</template>

<style lang="scss" module="s"></style>
