<script setup lang="ts">
import configuratorParams from './configurator-params/index.vue'
import configuratorNavigation from './configurator-navigation/index.vue'
import { singleWatchModelType } from 'types/watchModels'
const props = defineProps<{
    selectedWatchModel: singleWatchModelType | null
    currentStepNum: number
}>()
</script>

<template>
    <div :class="[s.configuratorControls]">
        <transition name="fade-right">
            <configurator-params
                v-if="currentStepNum > 1"
                :selected-watch-model="props.selectedWatchModel"
                :current-step-num="props.currentStepNum"
            />
        </transition>
        <configurator-navigation :class="s.configuratorControlsNav" />
    </div>
</template>

<style lang="scss" module="s">
.configuratorControls {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 30px;
    min-height: 102px;
}
.configuratorControlsNav {
    align-self: flex-start;
}
@media (max-width: 750px) {
    .configuratorControls {
        min-height: 0;
    }
}
</style>
