<script setup lang="ts">
import { ref, type Ref, reactive } from 'vue'
import streetSearchField from './street-search-field/index.vue'
import buildingSearchField from './building-search-field/index.vue'
import inputField from '@/components/UI/input-field.vue'
import type { addressListItemType } from 'types/address'
const props = defineProps<{
    cityName: string
    needValidate: boolean
}>()
const state = reactive({
    street: '',
    building: '',
    appartament: ''
})
const emit = defineEmits(['updateDeliveryState'])
const selectedStreetFiasId: Ref<string | null> = ref(null)
const onStreetSelect = (item: addressListItemType) => {
    selectedStreetFiasId.value = item.data.street_fias_id
}
watch(
    () => state,
    () => {
        emit('updateDeliveryState', state)
    },
    {
        deep: true
    }
)
</script>

<template>
    <div :class="s.address">
        <street-search-field
            v-model="state.street"
            :need-validate="props.needValidate"
            :class="s.streetSearch"
            :city-name="props.cityName"
            @street-select="onStreetSelect"
        />
        <building-search-field
            v-model="state.building"
            :need-validate="props.needValidate"
            :class="s.buildingSearch"
            :city-name="props.cityName"
            :street-fias-id="selectedStreetFiasId"
        />
        <input-field
            v-model="state.appartament"
            :class="s.appartamentNum"
            title="Квартира/офис"
        />
    </div>
</template>

<style lang="scss" module="s">
.address {
    margin-top: 44px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 22px 40px;
    @media (max-width: 550px) {
        margin-top: 22px;
    }
}
.streetSearch {
    grid-column: 1/3;
}
</style>
