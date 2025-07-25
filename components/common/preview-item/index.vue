<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import previewItemParam from './preview-item-param/index.vue'
import { watchStrapDataType } from '@/types/watchStraps'
import frameColorsType from '@/types/frameColors'
import { useConfiguratorStore } from '@/store/configuratorStore'
const props = defineProps<{
    view: number
}>()
const configuratorStore = useConfiguratorStore()
const leatherColors = computed(() => {
    return selectedStrap.value?.leather_colors
})
const stitchingColors = computed(() => {
    return selectedStrap.value?.stitching_colors
})
const edgeColors = computed(() => {
    return selectedStrap.value?.edge_colors
})
const buckleColors = computed(() => {
    return selectedStrap.value?.buckle_colors
})
const adapterColors = computed(() => {
    return selectedStrap.value?.adapter_colors
})
const frameColors: ComputedRef<frameColorsType | null> = computed(() => {
    return configuratorStore.selectedWatchModelFrameColors || null
})
const selectedWatchModel = computed(() => {
    return configuratorStore.selectedWatchModel
})
const selectedStrap: ComputedRef<watchStrapDataType | null> = computed(() => {
    return configuratorStore.selectedStrapModel?.attributes.watch_strap || null
})
const mainImage = computed(() => {
    if (
        selectedWatchModel.value?.model_name
            .toLocaleLowerCase()
            .includes('ultra')
    ) {
        return props.view === 1
            ? selectedStrap.value?.view_1?.ultra_main_image?.data?.attributes
                  .url
            : props.view === 2
            ? selectedStrap.value?.view_2?.ultra_main_image?.data?.attributes
                  .url
            : props.view === 3
            ? selectedStrap.value?.view_3?.ultra_main_image?.data?.attributes
                  .url
            : selectedStrap.value?.view_1?.ultra_main_image?.data?.attributes
                  .url
    } else {
        return props.view === 1
            ? selectedStrap.value?.view_1?.main_image?.data?.attributes.url
            : props.view === 2
            ? selectedStrap.value?.view_2?.main_image?.data?.attributes.url
            : props.view === 3
            ? selectedStrap.value?.view_3?.main_image?.data?.attributes.url
            : selectedStrap.value?.view_1?.main_image?.data?.attributes.url
    }
})
</script>

<template>
    <div v-if="selectedStrap" :class="s.previewItem">
        <div :class="s.previewItemInner">
            <img
                v-if="mainImage"
                rel="preload"
                :class="s.previewMainImage"
                :src="$config.public.API_BASE_URL + mainImage || ''"
                alt=""
            />
            <preview-item-param
                v-if="frameColors"
                :view="props.view"
                :frame-colors="frameColors"
                :selected-strap-model="selectedStrap"
            />
            <preview-item-param
                v-if="leatherColors"
                :view="props.view"
                :param-list="leatherColors"
            />
            <preview-item-param
                v-if="stitchingColors"
                :view="props.view"
                :param-list="stitchingColors"
            />
            <preview-item-param
                v-if="edgeColors"
                :view="props.view"
                :param-list="edgeColors"
            />
            <preview-item-param
                v-if="buckleColors"
                :view="props.view"
                :param-list="buckleColors"
            />
            <preview-item-param
                v-if="adapterColors"
                :view="props.view"
                :param-list="adapterColors"
            />
        </div>
    </div>
</template>

<style lang="scss" module="s">
.previewItem {
    position: relative;
    background: #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
}
.previewItemInner {
    position: relative;
    width: 100%;
    height: 100%;
}
.previewMainImage {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    height: 85%;
    margin: auto;
    object-fit: contain;
}
</style>
