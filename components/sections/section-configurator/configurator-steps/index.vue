<script setup lang="ts">
import watchModelStep from './watch-model-step/index.vue'
import strapModelStep from './strap-model-step/index.vue'
import strapDesignStep from './strap-design-step/index.vue'
import finalStep from './final-step/index.vue'
import type watchModelsType from '@/types/watchModels'
import type { singleWatchModelType } from '@/types/watchModels'
const configuratorStore = useConfiguratorStore()
const watchModels: ComputedRef<watchModelsType | null> = computed(() => {
    return configuratorStore.watchModels
})
const selectedWatchModel: ComputedRef<singleWatchModelType | null> = computed(
    () => {
        return configuratorStore.selectedWatchModel
    }
)
const selectedWatchModelStraps = computed(() => {
    return configuratorStore.selectedWatchModelStraps
})
const selectedStrapModel = computed(() => {
    return configuratorStore.selectedStrapModel
})
const currentStepNum = computed(() => {
    return configuratorStore.currentStepNum
})
configuratorStore.$subscribe((_mutation, state) => {
    state.steps.strap.isChoosen = !!configuratorStore.selectedStrapModel
    state.steps.strap.strapName =
        configuratorStore.selectedStrapModel?.attributes.watch_strap
            .strap_title || null
    state.steps.strap.strapPrice =
        configuratorStore.selectedStrapModel?.attributes.watch_strap.price ||
        null
})
watch(currentStepNum, (curr, prev) => {
    animationArr.value.forEach((item, idx, arr) => {
        if (item.id === curr) {
            if (prev > curr) {
                item.name = 'fade-left-static'
                if (arr[idx + 1]) {
                    arr[idx + 1].name = 'fade-right-static'
                }
            } else {
                item.name = 'fade-right-static'
                if (arr[idx - 1]) {
                    arr[idx - 1].name = 'fade-left-static'
                }
            }
        }
    })
})
const animationArr = ref([
    {
        id: 1,
        name: 'fade-left-static'
    },
    {
        id: 2,
        name: 'fade-left-static'
    },
    {
        id: 3,
        name: 'fade-left-static'
    },
    {
        id: 4,
        name: 'fade-left-static'
    }
])
watch(
    () => configuratorStore.selectedWatchModel,
    (model) => {
        configuratorStore.steps.model.isChoosen = !!model
    }
)
watch(
    () => configuratorStore.selectedWatchModelSize,
    (size) => {
        configuratorStore.steps.model.modelSize = size?.watch_size || ''
    }
)
watch(
    () =>
        configuratorStore.selectedStrapModel?.attributes.watch_strap
            .buckle_butterfly_choosen,
    (boo) => {
        configuratorStore.steps.strapDesign.buckleButterflyChoosen = !!boo
    }
)
watch(
    () => configuratorStore.isStrapParamsSelected,
    (boo) => {
        configuratorStore.steps.strapDesign.isChoosen = boo
    }
)
watch(
    () => configuratorStore.selectedLeatherColor,
    (color) => {
        configuratorStore.steps.strapDesign.leatherColor.title =
            color?.color_title || ''
        configuratorStore.steps.strapDesign.leatherColor.name =
            color?.color_name || ''
    }
)
watch(
    () => configuratorStore.selectedLeatherColor,
    (color) => {
        configuratorStore.steps.strapDesign.leatherColor.title =
            color?.color_title || ''
        configuratorStore.steps.strapDesign.leatherColor.name =
            color?.color_name || ''
    }
)
watch(
    () => configuratorStore.selectedEdgeColor,
    (color) => {
        configuratorStore.steps.strapDesign.edgeColor.title =
            color?.color_title || ''
        configuratorStore.steps.strapDesign.edgeColor.name =
            color?.color_name || ''
    }
)
watch(
    () => configuratorStore.selectedStitchingColor,
    (color) => {
        configuratorStore.steps.strapDesign.stitchingColor.title =
            color?.color_title || ''
        configuratorStore.steps.strapDesign.stitchingColor.name =
            color?.color_name || ''
    }
)
watch(
    () => configuratorStore.selectedBuckleColor,
    (color) => {
        configuratorStore.steps.strapDesign.buckleColor.title =
            color?.color_title || ''
        configuratorStore.steps.strapDesign.buckleColor.name =
            color?.color_name || ''
    }
)
watch(
    () => configuratorStore.selectedAdapterColor,
    (color) => {
        configuratorStore.steps.strapDesign.adapterColor.title =
            color?.color_title || ''
        configuratorStore.steps.strapDesign.adapterColor.name =
            color?.color_name || ''
    }
)
watch(
    () =>
        configuratorStore.additionalOption?.data.attributes.additional_options.find(
            (option) => option.option_name === 'initials'
        )?.choosen,
    (boo) => {
        configuratorStore.steps.final.additionalOptions.initials.choosen = !!boo
    }
)
watch(
    () =>
        configuratorStore.additionalOption?.data.attributes.additional_options.find(
            (option) => option.option_name === 'present_box'
        )?.choosen,
    (boo) => {
        configuratorStore.steps.final.additionalOptions.presentBox.choosen =
            !!boo
    }
)
watch(
    () =>
        configuratorStore.additionalOption?.data.attributes.additional_options.find(
            (option) => option.option_name === 'postcard'
        )?.choosen,
    (boo) => {
        configuratorStore.steps.final.additionalOptions.postCard.choosen = !!boo
    }
)
watch(
    () => configuratorStore.usedPromo,
    (promo) => {
        if (promo) {
            configuratorStore.steps.final.promo.used = promo.promoFound
            configuratorStore.steps.final.promo.discountValue =
                promo.discountValue
            configuratorStore.steps.final.promo.code = promo.code
            configuratorStore.steps.final.promo.discountValueFull =
                promo?.type === 'percent'
                    ? promo.discountValue + '%'
                    : promo.type === 'ruble'
                    ? promo.discountValue + ' руб'
                    : String(promo.discountValue)
        }
    },
    {
        deep: true
    }
)
const onFixedView = (value: boolean) => {
    emit('fixedView', value)
}
const emit = defineEmits(['fixedView'])
</script>

<template>
    <div class="configurator-steps">
        <transition :name="animationArr[0].name">
            <watch-model-step
                class="configurator__steps_section"
                :watch-models="watchModels"
            />
        </transition>
        <transition :name="animationArr[1].name">
            <strap-model-step
                v-if="currentStepNum === 2"
                class="configurator__steps_section"
                :watch-straps="selectedWatchModelStraps || null"
            />
        </transition>
        <transition :name="animationArr[2].name">
            <strap-design-step
                v-if="
                    currentStepNum === 3 &&
                    selectedWatchModel &&
                    selectedStrapModel
                "
                class="configurator__steps_section"
                :selected-watch-model="selectedWatchModel"
                :selected-strap-model="selectedStrapModel"
                @fixed-view="onFixedView"
            />
        </transition>
        <transition :name="animationArr[3].name">
            <final-step
                v-if="
                    currentStepNum === 4 &&
                    selectedWatchModel &&
                    selectedStrapModel
                "
                class="configurator__steps_section"
                :selected-watch-model="selectedWatchModel"
                :selected-strap-model="selectedStrapModel"
            />
        </transition>
    </div>
</template>

<style lang="scss">
.configurator-steps {
    position: relative;
    min-height: 480px;
}
@media (max-width: 1100px) {
    .configurator-steps {
        min-height: 400px;
    }
}
</style>
