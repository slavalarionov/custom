<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import designParamItem from './design-param-item/index.vue'
import type { strapParamsType, watchStrapDataType } from '@/types/watchStraps'
const props = defineProps<{
    params: strapParamsType | null
    selectedStrapModel: watchStrapDataType
}>()
const strapParams: ComputedRef<strapParamsType | null> = computed(() => {
    return props.params
})
const selectedStrapModel: ComputedRef<watchStrapDataType> = computed(() => {
    return props.selectedStrapModel
})
</script>

<template>
    <div v-if="strapParams" :class="s.params">
        <design-param-item
            v-for="(item, idx) in strapParams"
            :id="idx"
            :key="idx"
            :params-amount="strapParams.length"
            :param-name="item.param_name"
            :param-title="item.param_title"
            :param-price="item.param_price"
            :selected-strap-model="selectedStrapModel"
            :class="s.paramItem"
        />
    </div>
</template>

<style lang="scss" module="s">
.params {
    width: 100%;
    margin-top: 75px;
}
</style>
