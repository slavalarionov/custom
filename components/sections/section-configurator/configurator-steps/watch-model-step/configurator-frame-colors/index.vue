<script setup lang="ts">
import type frameColorsType from '@/types/frameColors'
const configuratorStore = useConfiguratorStore()
const watchFrameColors: ComputedRef<frameColorsType | null> = computed(() => {
    return configuratorStore.selectedWatchModelFrameColors
})
</script>

<template>
    <transition name="fade-left">
        <div
            v-if="watchFrameColors === null || watchFrameColors?.length"
            class="configurator__frame-colors"
        >
            <div class="configurator__frame-colors_inner">
                <div
                    v-if="!watchFrameColors"
                    class="configurator__frame-colors_item configurator__frame-colors_empty-item"
                >
                    <div class="configurator__frame-colors_item_preview"></div>
                    <p class="configurator__frame-colors_item_name">
                        Цвет часов
                    </p>
                </div>
                <transition name="fade-left">
                    <div
                        v-if="watchFrameColors"
                        class="configurator__frame-colors_items-row"
                    >
                        <button
                            v-for="(color, idx) in watchFrameColors"
                            :key="idx"
                            type="button"
                            :class="[
                                'configurator__frame-colors_item',
                                { choosen: color.choosen }
                            ]"
                            @click="
                                configuratorStore.chooseFrameColor(
                                    color.color_name
                                )
                            "
                        >
                            <div
                                class="configurator__frame-colors_item_preview"
                                :style="{ background: color.color_code }"
                            ></div>
                            <p class="configurator__frame-colors_item_name">
                                {{ color.color_title }}
                            </p>
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>

<style lang="scss">
.configurator__frame-colors {
    width: fit-content;
    display: flex;
    justify-content: space-between;
    margin-top: 44px;
    &_inner {
        display: flex;
        justify-content: center;
    }
    &_items-row {
        display: flex;
        justify-content: space-between;
    }
    &_item {
        display: flex;
        align-items: center;
        border-radius: 56px;
        background: #f5f5f5;
        padding: 16px 26px 16px 16px;
        border: 1px solid transparent;
        margin-right: 16px;
        cursor: pointer;
        transition: $base-transition;
        &:last-child {
            margin-right: 0;
        }
        &.choosen {
            background: #fff;
            border-color: #01416d;
        }
    }
    &_empty-item {
        & .configurator__frame-colors_item_preview {
            background: #e9e9e9;
        }
        & .configurator__frame-colors_item_name {
            color: #a9a9a9;
        }
    }
    &_item_preview {
        min-width: 32px;
        max-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        margin-right: 16px;
    }
    &_item_name {
        font-size: 16px;
        line-height: 20px;
    }
}
@media (max-width: 1100px) {
    .configurator__frame-colors {
        display: none;
    }
}
</style>
