<script setup lang="ts">
import { computed, type ComputedRef, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper/types'
import { useConfiguratorStore } from '@/store/configuratorStore'
import type { watchStrapDataType, strapColorParam } from '@/types/watchStraps'
import 'swiper/css'
const props = defineProps<{
    id: number
    paramsAmount: number
    paramTitle: string
    paramName: string
    paramPrice: number
    selectedStrapModel: watchStrapDataType
}>()
type optionsDataType = {
    list: strapColorParam[]
    hasButterflyBuckle?: boolean
    func: any
}
const configuratorStore = useConfiguratorStore()
const optionsData: ComputedRef<optionsDataType | null> = computed(() => {
    if (
        props.paramName === 'leather_color' &&
        props.selectedStrapModel.leather_colors
    ) {
        return {
            list: props.selectedStrapModel.leather_colors,
            func: configuratorStore.chooseStrapLeatherColor
        }
    } else if (
        props.paramName === 'stitching_color' &&
        props.selectedStrapModel.stitching_colors
    ) {
        return {
            list: props.selectedStrapModel.stitching_colors,
            func: configuratorStore.chooseStitchingColor
        }
    } else if (
        props.paramName === 'edge_color' &&
        props.selectedStrapModel.edge_colors
    ) {
        return {
            list: props.selectedStrapModel.edge_colors,
            func: configuratorStore.chooseEdgeColor
        }
    } else if (
        props.paramName === 'buckle_color' &&
        props.selectedStrapModel.buckle_colors
    ) {
        return {
            list: props.selectedStrapModel.buckle_colors,
            hasButterflyBuckle: props.selectedStrapModel.has_buckle_butterfly,
            func: configuratorStore.chooseBuckleColor
        }
    } else if (
        props.paramName === 'adapter_color' &&
        props.selectedStrapModel.adapter_colors
    ) {
        return {
            list: props.selectedStrapModel.adapter_colors,
            func: configuratorStore.chooseAdapterColor
        }
    } else return null
})
const buckleButtefly = computed(() => {
    return configuratorStore.buckleButterfly?.data.attributes
})
const sliderRef: Ref<SwiperType | null> = ref(null)
const initSlider = (swiper: SwiperType) => {
    sliderRef.value = swiper
}
const slideClick = (name: string) => {
    optionsData.value?.func(name)
    sliderRef.value?.update()
    setTimeout(() => {
        sliderRef.value?.updateSize()
    }, 200)
}
onMounted(() => {
    const initialMediaCheck = () => {
        if (!sliderRef.value) return
        if (window.matchMedia('(max-width: 1100px)').matches) {
            sliderRef.value?.enable()
            sliderRef.value.allowTouchMove = true
        } else {
            sliderRef.value?.disable()
            sliderRef.value.allowTouchMove = false
        }
    }
    initialMediaCheck()
    window.matchMedia('(max-width: 1100px)').addEventListener('change', (e) => {
        if (!sliderRef.value) return
        if (e.matches) {
            sliderRef.value?.enable()
            sliderRef.value.allowTouchMove = true
        } else {
            sliderRef.value?.disable()
            sliderRef.value.allowTouchMove = false
        }
    })
})
</script>

<template>
    <div :class="s.param">
        <div :class="s.paramHead">
            <h4 :class="s.paramTitle">
                <span :class="s.paramTitleNum">{{
                    `${props.id + 1}/${props.paramsAmount}`
                }}</span>
                <span :class="s.paramTitle">{{ props.paramTitle }}</span>
            </h4>
            <span v-if="props.paramPrice !== 0" :class="s.paramPrice"
                >+ {{ props.paramPrice }}₽</span
            >
        </div>
        <swiper
            v-if="
                optionsData &&
                optionsData.list?.length &&
                props.paramName !== 'adapter_color'
            "
            :class="[
                s.paramContent,
                s.commonParamContent,
                'commonParamContent'
            ]"
            :slides-per-view="'auto'"
            :space-between="10"
            :breakpoints="{
                550: {
                    spaceBetween: 0
                }
            }"
            @swiper="(swiper) => initSlider(swiper)"
        >
            <swiper-slide
                v-for="(option, idx) in optionsData.list"
                :key="idx"
                :class="[s.paramOption, { [s.choosen]: option.choosen }]"
                @click="slideClick(option.color_title)"
            >
                <div
                    :class="s.paramOptionColorPreview"
                    :style="`background-color: ${option.color_code}`"
                ></div>
                <span :class="s.paramOptionTitle">{{
                    option.color_title
                }}</span>
            </swiper-slide>
        </swiper>
        <div
            v-if="
                props.paramName === 'buckle_color' &&
                optionsData?.hasButterflyBuckle
            "
            :class="[
                s.paramBuckleButterfly,
                {
                    [s.choosen]:
                        configuratorStore.selectedStrapModel?.attributes
                            .watch_strap.buckle_butterfly_choosen
                }
            ]"
            @click="configuratorStore.chooseBuckleButterfly()"
        >
            <div :class="s.paramBuckleButterflyInner">
                <p :class="s.paramBuckleButterflyName">
                    {{ buckleButtefly?.buckle_name }}
                </p>
                <p :class="s.paramBuckleButterflyPrice">
                    + {{ buckleButtefly?.buckle_price }} ₽
                </p>
            </div>
            <img
                :src="
                    $config.public.API_BASE_URL +
                    buckleButtefly?.buckle_image?.data?.attributes.url
                "
                alt=""
                :class="s.paramBuckleButterflyImage"
            />
        </div>
        <swiper
            v-if="
                optionsData &&
                optionsData.list?.length &&
                props.paramName === 'adapter_color'
            "
            :class="[s.paramContent, s.adapterParamContent]"
            :slides-per-view="'auto'"
            :space-between="16"
            :breakpoints="{
                1300: {
                    slidesPerView: 5
                },
                1200: {
                    slidesPerView: 4
                }
            }"
        >
            <swiper-slide
                v-for="(option, idx) in selectedStrapModel.adapter_colors"
                :key="idx"
                :class="[
                    s.paramOption,
                    s.adapterParamOption,
                    { [s.choosen]: option.choosen }
                ]"
                @click="optionsData?.func(option.color_title)"
            >
                <div :class="s.paramOptionPreviewImgInner">
                    <img
                        :src="
                            $config.public.API_BASE_URL +
                            option.preview.data?.attributes?.url
                        "
                        alt=""
                        :class="s.paramOptionPreviewImg"
                    />
                </div>
                <span :class="s.paramOptionTitle">{{
                    option.color_title
                }}</span>
            </swiper-slide>
        </swiper>
    </div>
</template>

<style lang="scss" module="s">
.param {
    margin-top: 70px;
    &:first-child {
        margin-top: 0;
    }
}
.paramHead {
    display: flex;
    align-items: center;
}
.paramTitle {
    letter-spacing: 0.32px;
    &Num {
        margin-right: 5px;
    }
}
.paramPrice {
    margin-left: 12px;
    font-weight: 300;
    color: #9c9c9c;
}
.paramContent {
    margin-top: 36px;
    padding: 2px 0;
}
.commonParamContent {
    margin-left: 0;
    margin-right: 0;
}
.paramOption {
    flex: 1 1 auto;
    display: block;
    padding: 16px 26px 16px 16px;
    min-height: 62px;
    border-radius: 50px;
    max-width: fit-content;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 300;
    line-height: normal;
    border: 1px solid transparent;
    cursor: pointer;
    transition: $base-transition;
    &.choosen {
        border-color: #01416d;
        background: #fff;
    }
    &.adapterParamOption {
        flex: none;
        padding: 0;
        flex-direction: column;
        align-items: center;
        background: transparent;
        border-radius: 0;
        border: none;
        & .paramOptionTitle {
            display: block;
        }
        & .paramOptionPreviewImgInner {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 28px;
            background: #f4f4f4;
            width: 100%;
            max-width: 100px;
            margin-bottom: 13px;
            padding: 21px;
            border: 1px solid transparent;
            transition: $base-transition;
        }
        &.choosen .paramOptionPreviewImgInner {
            border-color: #01416d;
        }
    }
    &ColorPreview {
        min-width: 30px;
        min-height: 30px;
        border-radius: 50%;
        margin-right: 16px;
    }
}
.paramBuckleButterfly {
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: flex-start;
    padding: 30px 36px 20px;
    border-radius: 40px;
    border: 1px solid transparent;
    margin-top: 35px;
    transition: 0.2s ease;
    cursor: pointer;
    &:hover {
        border-color: #ccc;
    }
    &.choosen {
        border-color: $secondary-color;
    }
    &Inner {
    }
    &Name {
        font-size: 16px;
        color: #333333;
        line-height: normal;
        letter-spacing: 0.8px;
        margin-bottom: 6px;
    }
    &Price {
        font-size: 16px;
        font-weight: 300;
        line-height: 20px;
        color: #7a7a7a;
    }
    &Image {
        width: 100%;
        max-width: 140px;
        margin-left: 15px;
    }
}
@media (max-width: 1100px) {
    .commonParamContent {
        & .paramOption {
            & .paramOptionTitle {
                max-width: 0;
                overflow: hidden;
                margin-left: 0;
                white-space: nowrap;
                // transform: scale(0);
                opacity: 0;
                transition-duration: 0s;
            }
            &.choosen {
                & .paramOptionTitle {
                    max-width: 150px;
                    opacity: 1;
                    margin-left: 12px;
                    transition-duration: 0.5s;
                    transition:
                        max-width 0.5s ease-out,
                        opacity 0.4s ease;
                }
            }
        }
    }
    .adapterParamContent {
        max-width: none;
    }
    .paramOption {
        padding: 12px;
        min-height: 48px;
        &.choosen {
            padding: 12px 16px 12px 12px;
            &.adapterParamOption {
                padding: 0;
            }
        }
    }
    .paramOptionColorPreview {
        min-width: 22px;
        min-height: 22px;
        margin-right: 0;
    }
}
</style>
<style lang="scss">
.commonParamContent {
    margin-top: 36px;
    & .swiper-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }
}
@media (max-width: 1100px) {
    .commonParamContent {
        & .swiper-wrapper {
            gap: initial;
            flex-wrap: nowrap;
        }
    }
}
</style>
