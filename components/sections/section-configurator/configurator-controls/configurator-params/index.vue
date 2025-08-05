<script setup lang="ts">
import { singleWatchModelType } from 'types/watchModels'
const props = defineProps<{
    selectedWatchModel: singleWatchModelType | null
    currentStepNum: number
}>()
type paramsType = {
    id: number
    value: string
    options:
        | {
              value: string
              text: string
          }[]
        | null
    changeFunc: any
    visible: boolean
    preview?: string
    label?: string
}[]
const configuratorStore = useConfiguratorStore()
const watchModelsNames = computed(() => {
    if (configuratorStore.watchModels) {
        return configuratorStore.watchModels.map((model) => {
            return {
                value: model.watch_model_name,
                text: model.watch_model_name
            }
        })
    }
})
const selectedModelSizes = computed(() => {
    if (configuratorStore.selectedWatchModelAllSizes) {
        return configuratorStore.selectedWatchModelAllSizes.map((size) => {
            return {
                value: size.watch_size + 'mm',
                text: size.watch_size + 'mm'
            }
        })
    }
    return null
})
const selectedModelFrameColors = computed(() => {
    if (configuratorStore.selectedWatchModelFrameColors) {
        return configuratorStore.selectedWatchModelFrameColors.map((color) => {
            return {
                value: color.color_name,
                text: color.color_name
            }
        })
    }
    return null
})
const selectedFrameColor = computed(() => {
    if (configuratorStore.selectedFrameColor) {
        return configuratorStore.selectedFrameColor
    }
    return null
})
const selectedEdgeColor = computed(() => {
    if (configuratorStore.selectedEdgeColor) {
        return configuratorStore.selectedEdgeColor
    }
    return null
})
const selectedStitchingColor = computed(() => {
    if (configuratorStore.selectedStitchingColor) {
        return configuratorStore.selectedStitchingColor
    }
    return null
})
const selectedBuckleColor = computed(() => {
    if (configuratorStore.selectedBuckleColor) {
        return configuratorStore.selectedBuckleColor
    }
    return null
})
const selectedAdapterColor = computed(() => {
    if (configuratorStore.selectedAdapterColor) {
        return configuratorStore.selectedAdapterColor
    }
    return null
})
const selectedModelSize = computed(() => {
    if (configuratorStore.selectedWatchModelSize) {
        return configuratorStore.selectedWatchModelSize
    }
    return null
})
const selectedModelStraps = computed(() => {
    if (configuratorStore.selectedWatchModelStraps) {
        return configuratorStore.selectedWatchModelStraps.data.map((strap) => {
            return {
                value: strap.attributes.watch_strap.strap_title,
                text: strap.attributes.watch_strap.strap_title
            }
        })
    }
    return null
})
const leatherColors = computed(() => {
    return selectedStrapModel.value?.attributes?.watch_strap?.leather_colors?.map(
        (color) => {
            return {
                value: color.color_title,
                text: color.color_title
            }
        }
    )
})
const stitchingColors = computed(() => {
    return selectedStrapModel.value?.attributes?.watch_strap?.stitching_colors?.map(
        (color) => {
            return {
                value: color.color_title,
                text: color.color_title
            }
        }
    )
})
const edgeColors = computed(() => {
    return selectedStrapModel.value?.attributes?.watch_strap?.edge_colors?.map(
        (color) => {
            return {
                value: color.color_title,
                text: color.color_title
            }
        }
    )
})
const buckleColors = computed(() => {
    return selectedStrapModel.value?.attributes?.watch_strap?.buckle_colors?.map(
        (color) => {
            return {
                value: color.color_title,
                text: color.color_title
            }
        }
    )
})
const adapterColors = computed(() => {
    return selectedStrapModel.value?.attributes?.watch_strap?.adapter_colors?.map(
        (color) => {
            return {
                value: color.color_title,
                text: color.color_title
            }
        }
    )
})
const selectedStrapModel = computed(() => {
    if (configuratorStore.selectedStrapModel) {
        return configuratorStore.selectedStrapModel
    }
    return null
})
const paramsArr: ComputedRef<paramsType> = computed(() => {
    return [
        {
            id: 1,
            value: props.selectedWatchModel?.watch_model_name || '',
            options: watchModelsNames.value || null,
            changeFunc: configuratorStore.updateSelectedModel,
            visible: Boolean(
                watchModelsNames.value &&
                    configuratorStore.selectedWatchModel &&
                    props.currentStepNum > 1
            ),
            preview: ''
        },
        {
            id: 2,
            value: selectedModelSize.value?.watch_size + 'mm' || '',
            options: selectedModelSizes.value || null,
            changeFunc: configuratorStore.updateWatchModelSize,
            visible: Boolean(
                selectedModelSize.value &&
                    selectedModelSizes.value &&
                    props.currentStepNum > 1
            ),
            preview: ''
        },
        {
            id: 3,
            value: selectedFrameColor.value?.color_name || '',
            options: selectedModelFrameColors.value || null,
            changeFunc: configuratorStore.updateSelectedFrameColor,
            visible: Boolean(
                selectedFrameColor.value &&
                    selectedModelFrameColors.value &&
                    props.currentStepNum > 1
            ),
            preview: ''
        },
        {
            id: 4,
            value:
                selectedStrapModel.value?.attributes.watch_strap.strap_title ||
                '',
            options: selectedModelStraps.value || null,
            changeFunc: configuratorStore.updateSelectedStrap,
            visible: Boolean(
                selectedModelStraps.value &&
                    selectedStrapModel.value &&
                    props.currentStepNum > 2
            ),
            preview: ''
        }
    ]
})
const strapParamsArr: ComputedRef<paramsType> = computed(() => {
    return [
        {
            id: 5,
            value: configuratorStore.selectedLeatherColor?.color_title || '',
            options: leatherColors.value || null,
            changeFunc: configuratorStore.chooseStrapLeatherColor,
            visible: Boolean(
                configuratorStore.selectedLeatherColor &&
                    props.currentStepNum > 3
            ),
            preview: configuratorStore.selectedLeatherColor?.color_code,
            label: 'Цвет кожи'
        },
        {
            id: 6,
            value: configuratorStore.selectedStitchingColor?.color_title || '',
            options: stitchingColors.value || null,
            changeFunc: configuratorStore.chooseStitchingColor,
            visible: Boolean(
                selectedStitchingColor.value &&
                    stitchingColors.value &&
                    props.currentStepNum > 3
            ),
            preview: configuratorStore.selectedStitchingColor?.color_code,
            label: 'Цвет строчки'
        },
        {
            id: 7,
            value: configuratorStore.selectedEdgeColor?.color_title || '',
            options: edgeColors.value || null,
            changeFunc: configuratorStore.chooseEdgeColor,
            visible: Boolean(
                selectedEdgeColor.value &&
                    edgeColors.value &&
                    props.currentStepNum > 3
            ),
            preview: configuratorStore.selectedEdgeColor?.color_code,
            label: 'Цвет края'
        },
        {
            id: 8,
            value: configuratorStore.selectedBuckleColor?.color_title || '',
            options: buckleColors.value || null,
            changeFunc: configuratorStore.chooseBuckleColor,
            visible: Boolean(
                selectedBuckleColor.value &&
                    buckleColors.value &&
                    props.currentStepNum > 3
            ),
            preview: configuratorStore.selectedBuckleColor?.color_code,
            label: 'Цвет пряжки'
        },
        {
            id: 9,
            value: configuratorStore.selectedAdapterColor?.color_title || '',
            options: adapterColors.value || null,
            changeFunc: configuratorStore.chooseAdapterColor,
            visible: Boolean(
                selectedAdapterColor.value &&
                    adapterColors.value &&
                    props.currentStepNum > 3
            ),
            preview: configuratorStore.selectedAdapterColor?.color_code,
            label: 'Цвет адаптера'
        }
    ]
})
const paramsInners = computed(() => {
    return [paramsArr.value, strapParamsArr.value]
})
</script>

<template>
    <div v-if="props.selectedWatchModel" :class="s.params">
        <div
            v-for="(inner, idx) in paramsInners"
            :key="idx"
            :class="[
                s.paramsMain,
                s.paramsInner,
                { [s.strapDesignParams]: idx === 1 }
            ]"
        >
            <transition-group name="fade-right">
                <div
                    v-for="select in inner"
                    v-show="select.visible"
                    :key="select.id"
                    :class="[
                        s.paramsSelectWrapper,
                        {
                            [s.colorPreview]: select.preview,
                            [s.hideValue]: Boolean(select.label)
                        }
                    ]"
                >
                    <div
                        v-if="select.preview"
                        :class="[
                            s.paramsSelectColorPreview,
                            {
                                [s.borderVisible]:
                                    !select.preview ||
                                    select.preview === ('#FFF' || '#fff')
                            }
                        ]"
                        :style="`background: ${select.preview};}`"
                    ></div>
                    <p v-if="select.label" :class="s.paramsSelectLabel">
                        {{ select.label }}
                    </p>
                    <user-select
                        :class="[
                            s.paramsSelect,
                            { [s.hideValue]: Boolean(select.label) }
                        ]"
                        :value="select.value"
                        :options="select.options"
                        :hide-value="Boolean(select.label)"
                        @change="
                            select.changeFunc(
                                ($event.target as HTMLSelectElement).value
                            )
                        "
                    >
                    </user-select>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<style lang="scss" module="s">
.paramsWrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-width: 920px;
    & .fade-enter-active {
        transition-delay: 0;
    }
}
.params {
    &Inner {
        flex-basis: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 20px;
        @media (max-width: 750px) {
            justify-content: space-between;
        }
    }
}
.strapDesignParams {
    @media (max-width: 750px) {
        margin-right: 0;
    }
}
.paramsSelectWrapper {
    position: relative;
    margin-right: 16px;
    margin-bottom: 16px;
    overflow: hidden;
    &:last-child {
        margin-right: 0;
    }
    &.hideValue {
        display: flex;
        align-items: center;
        padding: 10px 42px 13px 13px;
    }
    &.colorPreview {
        & .paramsSelect .userSelect {
            padding-left: 51px;
        }
    }
    @media (max-width: 750px) {
        margin-right: 10px;
        flex: 1 1 auto;
    }
}
.paramsSelectColorPreview {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: #fff;
    margin-right: 10px;
    border: 1px solid transparent;
    z-index: 10;
    transition: 0.2s ease;
    pointer-events: none;
    &.borderVisible {
        border-color: #9c9c9c;
    }
}
.paramsSelect {
    width: fit-content;
    min-width: 110px;
    cursor: pointer;
    width: 100%;
    max-width: 190px;
    .hideValue & {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
.paramsSelectLabel {
    font-size: 16px;
    line-height: 1;
    color: #333;
    z-index: 10;
    pointer-events: none;
    @media (max-width: 750px) {
        font-size: 14px;
    }
}
@media (max-width: 750px) {
    .params {
        width: 100%;
        &_inner {
            &:nth-child(2) {
                // display: none;
            }
        }
    }
}
</style>
