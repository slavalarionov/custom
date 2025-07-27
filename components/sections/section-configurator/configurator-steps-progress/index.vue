<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import type configuratorSteps from '@/types/configuratorSteps'
import 'swiper/css'
const props = defineProps<{
    steps: configuratorSteps
}>()
const router = useRouter()
const configuratorStore = useConfiguratorStore()
const currentStepsNum = computed(() => {
    return configuratorStore.currentStepNum
})
const stepsAmount = computed(() => {
    return configuratorStore.stepsAmount
})
const navigateToStep = (name: string) => {
    if (
        props.steps[name as keyof typeof props.steps].id <=
        configuratorStore.currentAvailableStep
    ) {
        router.push({
            query: {
                step: props.steps[name as keyof typeof props.steps].queryParam
            }
        })
    }
}
const swiperInstance: Ref<null | any> = ref(null)
const initSwiper = (e) => {
    swiperInstance.value = e
}
watch(
    () => configuratorStore.currentStepNum,
    () => {
        if (swiperInstance.value) {
            swiperInstance.value.slideTo(configuratorStore.currentStepNum - 1)
        }
    }
)
</script>

<template>
    <div :class="s.progress">
        <swiper
            :class="s.progressList"
            :slides-per-view="'auto'"
            :space-between="0"
            :breakpoints="{
                1400: {
                    spaceBetween: 40,
                    slidesPerView: 4
                },
                1360: {
                    spaceBetween: 30,
                    slidesPerView: 4
                },
                1200: {
                    spaceBetween: 30,
                    slidesPerView: 'auto'
                },
                700: {
                    spaceBetween: 30,
                    slidesPerView: 'auto'
                }
            }"
            @swiper="initSwiper"
        >
            <swiper-slide
                v-for="(item, idx) in props.steps"
                :key="idx"
                :class="[
                    s.progressItem,
                    {
                        [s.current]: currentStepsNum === item.id,
                        [s.completed]: item.id <= currentStepsNum
                    }
                ]"
                @click="navigateToStep(idx)"
            >
                <span
                    v-if="item.id === currentStepsNum"
                    :class="s.progressItemNum"
                >
                    {{ `${item.id}/${stepsAmount}` }}</span
                >
                {{ item.title }}
            </swiper-slide>
        </swiper>
    </div>
</template>

<style lang="scss" module="s">
.progress {
    width: 100%;
    margin-top: 56px;
}
.progressList {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.progressItem {
    position: relative;
    display: block;
    max-width: 320px;
    width: 30%;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding-bottom: 20px;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    &::before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #e9e9e9;
    }
    &::after {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: #4e68f2;
        transition: 0.4s ease;
    }
    &.completed::after {
        width: 100%;
    }
    &.current {
        font-weight: 600;
    }
    &Num {
        display: inline-block;
        margin-right: 9px;
    }
}
@media (max-width: 1360px) {
    .progressItem {
        width: 31%;
        max-width: 300px;
        padding: 0 10px 20px;
        &:first-child {
            padding-left: 0;
        }
    }
}
@media (max-width: 1200px) {
    .progressItem {
        width: 31%;
    }
}
@media (max-width: 1015px) {
    .progressItem {
        width: 45%;
        max-width: 290px;
    }
}
@media (max-width: 700px) {
    .progressItem {
        width: fit-content;
        max-width: 300px;
        padding: 0 25px 16px;
        font-size: 14px;
    }
}
@media (max-width: 500px) {
    .progressItem {
        width: 100%;
        max-width: none;
    }
}
</style>
