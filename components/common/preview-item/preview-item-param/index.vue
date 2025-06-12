<script setup lang="ts">
import { useConfiguratorStore } from '@/store/configuratorStore'
import { strapColorParam, watchStrapDataType } from '@/types/watchStraps'
import frameColorsType from '@/types/frameColors'
const configuratorStore = useConfiguratorStore()
const props = defineProps<{
    paramList?: strapColorParam[]
    frameColors?: frameColorsType
    selectedStrapModel?: watchStrapDataType
    view: number
}>()
const selectedWatchModel = computed(() => {
    return configuratorStore.selectedWatchModel
})
const assetsList = computed(() => {
    return (
        props.paramList?.map((item) =>
            props.view === 1
                ? {
                      view: selectedWatchModel.value?.model_name
                          .toLocaleLowerCase()
                          .includes('ultra')
                          ? item.ultra_view_1
                          : item.view_1,
                      choosen: item.choosen
                  }
                : props.view === 2
                ? {
                      view: selectedWatchModel.value?.model_name
                          .toLocaleLowerCase()
                          .includes('ultra')
                          ? item.ultra_view_2
                          : item.view_2,
                      choosen: item.choosen
                  }
                : props.view === 3
                ? {
                      view: selectedWatchModel.value?.model_name
                          .toLocaleLowerCase()
                          .includes('ultra')
                          ? item.ultra_view_3
                          : item.view_3,
                      choosen: item.choosen
                  }
                : {
                      view: selectedWatchModel.value?.model_name
                          .toLocaleLowerCase()
                          .includes('ultra')
                          ? item.ultra_view_1
                          : item.view_1,
                      choosen: item.choosen
                  }
        ) || null
    )
})
const frameColorsList = computed(() => {
    return props.view === 1
        ? props.frameColors?.map((item) => {
              return {
                  color:
                      item.watch_model_color?.data?.attributes?.watch_models_straps_colors?.find(
                          (colorItem) =>
                              colorItem.strap_name ===
                              props.selectedStrapModel?.strap_name
                      )?.view_1?.data?.attributes.url || '',
                  choosen: item.choosen
              }
          }) || null
        : props.view === 3
        ? props.frameColors?.map((item) => {
              return {
                  color:
                      item.watch_model_color?.data?.attributes?.watch_models_straps_colors?.find(
                          (colorItem) =>
                              colorItem.strap_name ===
                              props.selectedStrapModel?.strap_name
                      )?.view_2?.data?.attributes.url || '',
                  choosen: item.choosen
              }
          }) || null
        : null
})
</script>

<template>
    <div v-if="props.paramList && props.paramList.length" :class="s.part">
        <div
            v-for="(item, idx) in assetsList"
            :key="idx"
            :class="s.partWrapper"
        >
            <div :class="s.partInner">
                <transition name="fade-delay">
                    <img
                        v-if="item?.view?.data?.attributes.url"
                        v-show="item.choosen"
                        rel="preload"
                        :src="
                            $config.public.API_BASE_URL +
                            item?.view?.data?.attributes.url
                        "
                        alt=""
                        :class="s.partImage"
                    />
                </transition>
            </div>
        </div>
    </div>
    <div
        v-else-if="
            props.frameColors &&
            props.frameColors.length &&
            frameColorsList?.length
        "
        :class="s.part"
    >
        <div
            v-for="(item, idx) in frameColorsList"
            :key="idx"
            :class="s.partWrapper"
        >
            <div :class="s.partInner">
                <transition name="fade-delay">
                    <img
                        v-if="item && item.color"
                        v-show="item.choosen"
                        rel="preload"
                        :src="$config.public.API_BASE_URL + item.color"
                        alt=""
                        :class="s.partImage"
                    />
                </transition>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module="s">
.part {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.partWrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.partImage {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    height: 85%;
    object-fit: contain;
}
</style>
