<script setup lang="ts">
import { useRoute } from 'vue-router'
import configuratorControls from '@/components/sections/section-configurator/configurator-controls/index.vue'
import configuratorSteps from '@/components/sections/section-configurator/configurator-steps/index.vue'
import ConfiguratorStepsProgress from '@/components/sections/section-configurator/configurator-steps-progress/index.vue'
import orderPopup from '@/components/order-popup/index.vue'
import type watchModelsType from '@/types/watchModels'
import type { singleWatchModelType } from '@/types/watchModels'
const configuratorStore = useConfiguratorStore()
const configuratorStepsArr = computed(() => {
    return configuratorStore.steps
})
const selectedWatchModel: ComputedRef<singleWatchModelType | null> = computed(
    () => {
        return configuratorStore.selectedWatchModel
    }
)
const watchModels: ComputedRef<watchModelsType | null> = computed(() => {
    return configuratorStore.watchModels
})
const currentStepNum = computed(() => {
    return configuratorStore.currentStepNum
})
const fixedView: Ref<boolean> = ref(false)
const onFixedView = (value: boolean) => {
    fixedView.value = value
}
const titleRef = ref<HTMLElement>()
const route = useRoute()
watch(
    () => route.fullPath,
    () => {
        setTimeout(() => {
            const configuratorProgressEl = titleRef.value
            if (window.innerWidth < 550) {
                window.scrollTo(0, 0)
            } else if (configuratorProgressEl) {
                window.scrollTo(0, configuratorProgressEl.offsetTop + 80 || 0)
            }
        }, 300)
    }
)
</script>

<template>
    <section :class="s.configuratorSection">
        <div
            :class="['container', s.container, s.configuratorSectionContainer]"
        >
            <h2 ref="titleRef" :class="s.configuratorTitle">
                Создай уникальный ремешок для своих Apple Watch
            </h2>
            <transition name="fade">
                <div :class="s.configuratorContent">
                    <configurator-steps-progress
                        :steps="configuratorStepsArr"
                    />
                    <div
                        :class="[
                            s.configuratorFixedViewLayer,
                            { [s.active]: fixedView }
                        ]"
                    ></div>
                    <configurator-controls
                        v-if="watchModels"
                        :selected-watch-model="selectedWatchModel"
                        :current-step-num="currentStepNum"
                    />
                    <configurator-steps
                        v-if="watchModels"
                        @fixed-view="onFixedView"
                    />
                </div>
            </transition>
        </div>
        <order-popup />
    </section>
</template>

<style lang="scss" module="s">
.configuratorSection {
    padding: 60px 0;
    @media (max-width: 550px) {
        padding: 20px 0;
    }
}
.configuratorTitle {
    max-width: 630px;
    font-weight: 300;
    font-size: 48px;
    color: #333;
}
@media (max-width: 1500px) {
    .configuratorTitle {
        font-size: 40px;
        max-width: 550px;
    }
}
@media (max-width: 1200px) {
    .configuratorTitle {
        font-size: 32px;
        max-width: 450px;
    }
}
@media (max-width: 750px) {
    .configuratorSection {
        position: relative;
        padding-top: 105px;
    }
    .configuratorTitle {
        font-size: 28px;
        max-width: 400px;
    }
}
@media (max-width: 700px) {
    .configuratorTitle {
        font-size: 24px;
        max-width: 350px;
    }
}
@media (max-width: 550px) {
    .configuratorFixedViewLayer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fff;
        z-index: 10;
        &.active {
            height: calc(88vw + 40px);
        }
    }
}
</style>
