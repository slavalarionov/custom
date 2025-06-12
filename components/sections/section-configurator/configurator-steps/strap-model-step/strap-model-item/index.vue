<script setup lang="ts">
import type { singleWatchStrap } from '@/types/watchStraps'
const configuratorStore = useConfiguratorStore()
const props = defineProps<{
    watchStrap: singleWatchStrap
}>()
const watchStrap = computed(() => {
    return props.watchStrap
})
const selectItem = (id: number) => {
    if (configuratorStore.watchStraps) configuratorStore.chooseStrapModel(id)
}
</script>

<template>
    <div
        :class="[s.item, { [s.choosen]: watchStrap.choosen }]"
        @click="selectItem(watchStrap.attributes.watch_strap.id)"
    >
        <div :class="s.itemImageInner">
            <img
                v-if="
                    !configuratorStore.selectedWatchModel?.model_name.includes(
                        'ultra'
                    )
                "
                rel="preload"
                :src="
                    $config.public.API_BASE_URL +
                    watchStrap.attributes.watch_strap.preview_image?.data
                        .attributes.url
                "
                width="150"
                height="185"
                alt=""
                :class="s.itemImage"
            />
            <img
                v-else
                rel="preload"
                :src="
                    $config.public.API_BASE_URL +
                    watchStrap.attributes.watch_strap.ultra_preview_image?.data
                        .attributes.url
                "
                width="150"
                height="185"
                alt=""
                :class="s.itemImage"
            />
        </div>
        <h4 :class="s.itemTitle">
            {{ watchStrap.attributes.watch_strap.strap_title }}
        </h4>
        <p :class="s.itemDescription">
            {{ watchStrap.attributes.watch_strap.strap_description }}
        </p>
        <p :class="s.itemPrice">
            {{ watchStrap.attributes.watch_strap.price }}₽
        </p>
        <transition name="fade">
            <primary-btn
                v-if="watchStrap.choosen"
                :class="s.itemNextBtn"
                :active="watchStrap.choosen"
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
</template>

<style lang="scss" module="s">
.item {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    max-width: 220px;
    &.choosen {
        .itemImageInner {
            border-color: #01416d;
            background: #fff;
        }
    }
    &ImageInner {
        position: relative;
        width: 100%;
        height: 100%;
        max-height: 260px;
        border-radius: 56px;
        background: #efefef;
        min-height: 260px;
        border: 1px solid transparent;
        transition: 0.2s ease;
        overflow: hidden;
    }
    &Image {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 70%;
        height: 70%;
        background-position: center center;
        object-fit: contain;
        pointer-events: none;
    }
    &Title {
        font-size: 24px;
        font-weight: 500;
        line-height: normal;
        margin-top: 26px;
    }
    &Description {
        color: #585858;
        font-size: 14px;
        line-height: normal;
        font-weight: 300;
        margin-top: 10px;
        margin-bottom: 12px;
    }
    &Price {
        font-size: 14px;
        font-weight: 300;
        line-height: 18px;
        margin-top: auto;
    }
    &NextBtn {
        width: 100%;
        max-width: 100%;
        margin-top: 30px;
        &.fade-enter-active,
        &.fade-leave-active {
            transition: opacity 0.3s ease;
        }
        &.fade-enter-from,
        &.fade-leave-to {
            opacity: 0;
        }
    }
}
@media (max-width: 1350px) {
    .item {
        max-width: 300px;
    }
}
@media (max-width: 850px) {
    .item {
        max-width: 300px;
    }
}
@media (max-width: 650px) {
    .item {
        max-width: none;
        &Description {
            max-width: 230px;
        }
    }
}
@media (max-width: 500px) {
    .item {
        &ImageInner {
            border-radius: 38px;
        }
        &Title {
            font-size: 20px;
        }
        &Description {
            font-size: 12px;
            margin-top: 10px;
            margin-bottom: 8px;
            max-width: 180px;
        }
    }
}
</style>
