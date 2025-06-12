<script setup lang="ts">
import {
    computed,
    type ComputedRef,
    onMounted,
    onBeforeUnmount,
    watch
} from 'vue'
import { useRoute } from 'vue-router'
import designStepPreview from './design-preview/index.vue'
import designStepParams from './design-params/index.vue'
import type { singleWatchModelType } from 'types/watchModels'
import type { singleWatchStrap, strapParamsType } from 'types/watchStraps'
const props = defineProps<{
    selectedWatchModel: singleWatchModelType
    selectedStrapModel: singleWatchStrap
}>()
const route = useRoute()
const configuratorStore = useConfiguratorStore()
const selectedStrapModel = computed(() => {
    return props.selectedStrapModel.attributes.watch_strap
})
const strapParams: ComputedRef<strapParamsType | null> = computed(() => {
    if (selectedStrapModel.value) {
        return selectedStrapModel.value.strap_params
    }
    return null
})
/* configuratorStore.$subscribe((_mutation, state) => {
    const strap = configuratorStore.selectedStrapModel?.attributes.watch_strap
    if (strap && configuratorStore.selectedStrapModel.dataFetched) {
        state.steps.strapDesign.leatherColor =
            strap.leather_colors.find((color) => color.choosen)?.color_title ||
            null
        state.steps.strapDesign.stitchingColor =
            strap.stitching_colors.find((color) => color.choosen)
                ?.color_title || null
        state.steps.strapDesign.edgeColor =
            strap.edge_colors.find((color) => color.choosen)?.color_title ||
            null
        state.steps.strapDesign.buckleColor =
            strap.buckle_colors.find((color) => color.choosen)?.color_title ||
            null
        state.steps.strapDesign.adapterColor =
            strap.adapter_colors.find((color) => color.choosen)?.color_title ||
            null
    }
}) */
const viewFixed: Ref<boolean> = ref(false)
const stepRef = ref<HTMLElement>()
const designStepPreviewRef = ref<InstanceType<
    typeof designStepPreview
> | null>()
const scrollHandler = () => {
    if (designStepPreviewRef.value?.$el.getBoundingClientRect().top < 20) {
        viewFixed.value = true
    } else {
        viewFixed.value = false
    }
}
onMounted(() => {
    window.addEventListener('scroll', scrollHandler)
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollHandler)
})
watch(viewFixed, (value) => {
    emit('fixedView', value)
})
watch(
    () => route.fullPath,
    () => {
        viewFixed.value = false
    }
)
const emit = defineEmits(['fixedView'])
</script>

<template>
    <transition name="fade-right">
        <div ref="stepRef" :class="s.step">
            <div :class="[s.stepContent, { [s.fixedView]: viewFixed }]">
                <design-step-preview
                    ref="designStepPreviewRef"
                    :class="[s.stepColumn, s.stepLeftColumn]"
                    :view-fixed="viewFixed"
                />
                <div :class="[s.stepColumn, s.stepRightColumn]">
                    <h3 :class="s.stepTitle">
                        Ваш ремешок {{ selectedStrapModel.strap_title }}
                    </h3>
                    <p :class="s.stepPrice">{{ selectedStrapModel.price }} ₽</p>
                    <div :class="s.stepDescription">
                        <p
                            :class="s.stepDescription_text"
                            v-html="selectedStrapModel.strap_full_description"
                        ></p>
                    </div>
                    <design-step-params
                        :params="strapParams || null"
                        :selected-strap-model="selectedStrapModel"
                    />
                    <primary-btn
                        :class="s.stepNextStepBtn"
                        :disabled="!configuratorStore.nextStepReady"
                        :active="configuratorStore.isStrapParamsSelected"
                        @click="
                            $router.push({
                                query: { step: configuratorStore.nextStepQuery }
                            })
                        "
                    >
                        Далее
                        {{
                            `${configuratorStore.currentStepNum + 1}/${
                                configuratorStore.stepsAmount
                            }`
                        }}
                    </primary-btn>
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" module="s">
.step {
    width: 100%;
    margin-top: 50px;
}
.stepContent {
    display: flex;
}
.stepColumn {
    flex: 1 1 auto;
    width: 50%;
}
.stepLeftColumn {
    max-width: 800px;
    width: 60%;
    margin-right: 40px;
}
.stepRightColumn {
    width: 40%;
    max-width: 560px;
}
.stepTitle {
    font-size: 36px;
    font-weight: 300;
    line-height: 1.4em;
}
.stepPrice {
    font-size: 24px;
    font-weight: 300;
    line-height: 1.25em;
    margin-top: 12px;
}
.stepDescription {
    width: 100%;
    max-width: 540px;
    margin-top: 36px;
}
.stepDescription_text {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.5em;
}
.stepNextStepBtn {
    width: 100%;
    margin-top: 78px;
}
@media (max-width: 1500px) {
    .stepTitle {
        font-size: 32px;
    }
    .stepPrice {
        font-size: 22px;
    }
}
@media (max-width: 1100px) {
    .stepColumn,
    .stepLeftColumn {
        width: 100%;
        flex: none;
    }
    .stepLeftColumn {
        margin-right: 0;
        margin-bottom: 48px;
    }
    .stepTitle {
        font-size: 28px;
    }
    .stepPrice {
        font-size: 18px;
    }
    .stepContent {
        flex-wrap: wrap;
        max-width: 800px;
        margin: 0 auto;
    }
}
@media (max-width: 550px) {
    .step {
        margin-top: 30px;
    }
    .stepTitle {
        font-size: 24px;
    }
    .stepPrice {
        font-size: 16px;
    }
    .stepDescription {
        margin-top: 20px;
    }
    .stepContent {
        &.fixedView {
            // padding-top: 96px;
        }
    }
}
</style>
