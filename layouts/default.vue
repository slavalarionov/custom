<script setup lang="ts">
import appHeader from '@/components/sections/app-header/index.vue'
import appFooter from '@/components/sections/app-footer/index.vue'
</script>

<template>
    <div :class="s.layout">
        <app-header />
        <slot></slot>
        <app-footer :class="s.footer" />
    </div>
</template>
<style lang="scss" module="s">
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.footer {
    margin-top: auto;
}
</style>
