<script setup lang="ts">
import configuratorFrameColors from './configurator-frame-colors/index.vue'
import type watchModelsType from 'types/watchModels'
import type frameColorsType from '@/types/frameColors'
const props = defineProps<{
    watchModels: watchModelsType | null
}>()
const configuratorStore = useConfiguratorStore()
const watchModels = computed(() => {
    return props.watchModels
})
const watchFrameColors: ComputedRef<frameColorsType | null> = computed(() => {
    return configuratorStore.selectedWatchModelFrameColors
})
watch(
    () => configuratorStore.selectedWatchModel,
    (model) => {
        configuratorStore.steps.model.modelName = model?.model_name || null
    }
)
watch(
    () => configuratorStore.selectedFrameColor,
    (color) => {
        configuratorStore.steps.model.color.code = color?.color_code || ''
        configuratorStore.steps.model.color.name = color?.color_name || ''
    }
)
watch(
    () => configuratorStore.selectedWatchModelSize,
    (value) => {
        if (value?.watch_size) {
            configuratorStore.steps.model.modelSize = value?.watch_size
            configuratorStore.steps.model.isChoosen = true
        }
    }
)
</script>

<template>
    <div v-if="configuratorStore.currentStepNum === 1" :class="s.step">
        <div v-if="watchModels" :class="s.stepContent">
            <div :class="s.stepInner">
                <div
                    v-for="(model, idx) in watchModels"
                    :key="idx"
                    :class="[s.stepItem, { [s.choosen]: model.choosen }]"
                    @click="
                        !model.choosen
                            ? configuratorStore.chooseWatchModel(idx)
                            : ''
                    "
                >
                    <img
                        rel="preload"
                        :src="
                            $config.public.API_BASE_URL +
                            model.main_image.data.attributes.url
                        "
                        width="150"
                        height="270"
                        alt=""
                        :class="s.stepItemImage"
                    />
                    <div :class="s.stepItemInfo">
                        <div :class="s.stepItemTitle">
                            <p :class="s.stepItemTitlePart">
                                {{ model.watch_model_manufacturer }}
                            </p>
                            <p :class="s.stepItemTitlePart">
                                {{ model.watch_model_name }}
                            </p>
                        </div>
                        <div :class="s.stepItemSizes">
                            <button
                                v-for="(item, id) in model.watch_sizes"
                                :key="id"
                                type="button"
                                :class="[
                                    s.stepItemSizesItem,
                                    { [s.choosen]: item.choosen }
                                ]"
                                @click.stop="
                                    configuratorStore.chooseWatchModel(idx, id)
                                "
                            >
                                {{ item.watch_size }}mm
                            </button>
                        </div>
                    </div>
                    <div
                        v-if="watchFrameColors && model.choosen"
                        :class="s.stepItemColors"
                    >
                        <div
                            v-for="(color, id) in watchFrameColors"
                            :key="id"
                            :class="[
                                s.stepItemColor,
                                { [s.choosen]: color.choosen }
                            ]"
                            @click="
                                configuratorStore.chooseFrameColor(
                                    color.color_name
                                )
                            "
                        >
                            <div
                                :class="s.stepItemColorPreview"
                                :style="`background: ${color.color_code};`"
                            ></div>
                        </div>
                    </div>
                    <transition name="fade">
                        <primary-btn
                            v-if="model.choosen"
                            :class="s.stepItemNextBtn"
                            :disabled="!configuratorStore.nextStepReady"
                            :active="
                                model.choosen && configuratorStore.nextStepReady
                            "
                            @click="
                                $router.push({
                                    query: {
                                        step: configuratorStore.nextStepQuery
                                    }
                                })
                            "
                        >
                            Далее
                            {{
                                configuratorStore.currentStepNum +
                                1 +
                                '/' +
                                configuratorStore.stepsAmount
                            }}
                        </primary-btn>
                    </transition>
                </div>
            </div>
            <configurator-frame-colors />
        </div>
    </div>
</template>

<style lang="scss" module="s">
.step {
    width: 100%;
    margin-top: 20px;
}
.stepInner {
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
}
.stepItem {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: flex-start;
    flex-basis: calc(25% - 30px);
    padding: 52px;
    border-radius: 56px;
    background: #f5f5f5;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.2s ease;
    &:hover {
        border-color: #b3b3b3;
    }
    &.choosen {
        border-color: $secondary-color;
        background: #fff;
    }
    &Image {
        pointer-events: none;
        width: 100%;
        max-width: 140px;
        margin-bottom: 30px;
        object-fit: cover;
    }
    &Info {
        margin-top: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    &Title {
        text-align: center;
        font-size: 16px;
        font-weight: 300;
        line-height: 24px;
    }
    &TitlePart {
        display: block;
    }
    &Sizes {
        width: 100%;
        max-width: 180px;
        display: flex;
        justify-content: center;
        margin-top: 14px;
        &Item {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1 1 auto;
            max-width: 85px;
            padding: 12px 20px;
            margin-right: 10px;
            border-radius: 50px;
            background: #e9e9e9;
            border: 1px solid transparent;
            cursor: pointer;
            transition: 0.2s ease;
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                border-color: #b3b3b3;
            }
            &.choosen {
                border-color: $secondary-color;
                background: #fff;
            }
        }
    }
    &Colors {
        width: 100%;
        display: none;
    }
    &Color {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 46px;
        min-height: 46px;
        border-radius: 50%;
        background: #f5f5f5;
        border: 1px solid transparent;
        margin-right: 10px;
        padding: 12px;
        transition: 0.2s ease;
        &:last-child {
            margin-right: 0;
        }
        &.choosen {
            border-color: $secondary-color;
        }
        &Preview {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: red;
        }
    }
    &NextBtn {
        position: absolute;
        bottom: -16px;
        left: 50%;
        transform: translate(-50%, 100%);
        width: 60%;
        max-width: 160px;
        display: none;
    }
}

@media (max-width: 1400px) {
    .stepItem {
        padding: 30px;
    }
}
@media (max-width: 1300px) {
    .stepItem {
        padding: 30px;
        flex-basis: calc(25% - 20px);
        &Image {
            max-width: 120px;
        }
        border-radius: 42px;
    }
    .stepItemSizes {
        &Item {
            font-size: 14px;
            line-height: 18px;
        }
    }
}
@media (max-width: 1100px) {
    .step {
        margin-top: 0;
    }
    .stepInner {
        flex-wrap: wrap;
        max-width: 800px;
        margin: 0 auto;
    }
    .stepItem {
        flex-direction: row;
        flex-wrap: wrap;
        flex-basis: calc(50% - 20px);
        &:nth-child(n + 3) {
            margin-top: 30px;
        }
        &Image {
            flex-basis: 30%;
            min-height: auto;
        }
        &Info {
            margin: 0 0 0 12px;
            flex-basis: 55%;
        }
        &Colors {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
            gap: 10px;
        }
        &Color {
            margin: 0;
        }
        &SizesItem {
            padding: 10px 16px;
            max-width: 80px;
        }
    }
}
@media (max-width: 850px) {
    .stepItem {
        flex-basis: calc(50% - 8px);
        padding: 20px 27px 20px 27px;
        &:nth-child(n + 3) {
            margin-top: 16px;
        }
        &Image {
            width: 38%;
            max-width: 170px;
            margin-bottom: 0;
        }
    }
}
@media (max-width: 750px) {
    .stepItem {
        justify-content: center;
    }
    .stepItemInfo {
        flex-basis: 100%;
    }
}
@media (max-width: 650px) {
    .stepInner {
        max-width: 500px;
    }
    .stepItemInfo {
        flex-basis: 55%;
        max-width: 220px;
    }
    .stepItem {
        flex-basis: 100%;
        justify-content: space-between;
        &:nth-child(n + 2) {
            margin-top: 16px;
        }
        &Info {
            width: fit-content;
        }
        &Image {
            flex-basis: 40%;
            min-height: 45vw;
        }
        &.choosen {
            margin-bottom: 83px;
        }
        &NextBtn {
            display: block;
        }
    }
}
@media (max-width: 400px) {
    .stepItem {
        &Info {
            width: 40%;
        }
        &Image {
            flex-basis: 38%;
        }
    }
}
@media (max-width: 370px) {
    .stepItem {
        &Title {
            font-size: 14px;
            line-height: 20px;
        }
        &Color {
            min-width: 38px;
            min-height: 38px;
            padding: 10px;
        }
        &SizesItem {
            font-size: 12px;
            line-height: 16px;
            padding: 8px 12px;
        }
    }
}
</style>
