<script setup lang="ts">
import { ref, type Ref, reactive, type ComputedRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { requiredIf } from '@vuelidate/validators'
import searchField from '@/components/core/search-field/index.vue'
import buildingSearchApi from '@/api/buildingSearchApi'
import type { addressListType } from '@/types/address'
import type { addressListItemType } from '@/types/address'

const props = defineProps<{
    streetFiasId: string | null
    needValidate: boolean
}>()
const emit = defineEmits(['streetFound', 'streetSelected', 'update:modelValue'])
const correctStreetSelectedRule = () =>
    !!selectedMenuItem.value || isSearching.value
const state = reactive({
    building: ''
})
const rules = {
    building: {
        required: requiredIf(() => props.needValidate),
        correctStreetSelectedRule
    }
}
const v$ = useVuelidate(rules, state)
const isSearching: Ref<boolean> = ref(false)
const searchMenuItems: Ref<addressListType | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const requestHandler = (_str: string) => {
    if (props.streetFiasId && state.building) {
        searchHandler(props.streetFiasId, state.building)
    }
}
const searchHandler = async (id: string, query: string) => {
    if (id !== null) {
        const res = await buildingSearchApi(id, query)
        if (res) {
            searchMenuItems.value = res
            emit('streetFound')
        } else {
            searchMenuItems.value = []
        }
    }
}
const searchResultEmpty: ComputedRef<boolean | null> = computed(() => {
    if (searchMenuItems.value) {
        return !(searchMenuItems.value.length > 0)
    }
    return null
})
const inputChangeHandler = () => {
    if (!searchMenuItems.value?.length || state.building === '') {
        state.building = ''
    }
    isSearching.value = false
}
const inputHandler = () => {
    isSearching.value = true
}
const onItemClick = (value: string) => {
    if (searchMenuItems.value) {
        const selectedItem = searchMenuItems.value?.find(
            (item) => item.value === value
        )
        if (selectedItem) {
            state.building = `${selectedItem.data.house}${
                selectedItem.data.block
                    ? ', стр. ' + selectedItem.data.block
                    : ''
            }`
            selectedItem.selected = true
            state.building = `${selectedItem.data.house}${
                selectedItem.data.block
                    ? ', стр. ' + selectedItem.data.block
                    : ''
            }`
        }
    }
}
const selectedMenuItem: ComputedRef<addressListItemType | null> = computed(
    () => {
        const item = searchMenuItems.value?.find(
            (item) =>
                `${item.data.house}${
                    item.data.block ? ', стр. ' + item.data.block : ''
                }`.toLocaleLowerCase() === state.building.toLocaleLowerCase()
        )
        return item || null
    }
)
watch(selectedMenuItem, (item) => {
    if (item) {
        emit('streetSelected', item)
    }
})
watch(
    () => state.building,
    (value) => {
        emit('update:modelValue', value)
    }
)
watch(
    () => props.streetFiasId,
    (id) => {
        if (id !== null) {
            searchHandler(id, state.building)
        }
    }
)
watch(
    () => props.needValidate,
    (boo: boolean) => {
        if (boo) {
            v$.value.$validate()
        }
    }
)
</script>

<template>
    <search-field
        v-model="state.building"
        :is-loading="isLoading"
        title="Дом"
        :is-result-empty="searchResultEmpty"
        empty-result-text="Результат пуст"
        error-message="Пожалуйста, выберите дом из списка"
        :is-valid="!(v$.$dirty && v$.building.$error)"
        @field-change="inputChangeHandler"
        @field-input="inputHandler"
        @request-enter="requestHandler"
    >
        <template #menuItems>
            <div
                v-for="item in searchMenuItems"
                :key="item.data.house_fias_id"
                :class="s.searchMenuItem"
                @click="onItemClick(item.value)"
            >
                <p :class="s.searchMenuItemType">
                    {{ item.data.house_type }}.&nbsp;
                </p>
                <div :class="s.searchMenuItemHouse">
                    {{ item.data.house }}
                </div>
                <div v-if="item.data.block" :class="s.searchMenuItemBlock">
                    ,&nbsp;{{ `стр. ${item.data.block}` }}
                </div>
            </div>
        </template>
    </search-field>
</template>

<style lang="scss" module="s">
.searchMenu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: fit-content;
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border-radius: 0 0 10px 10px;
    z-index: 1000;
    &Item {
        display: flex;
        cursor: pointer;
        padding: 12px 20px;
        transition: 0.2s ease;
        &:first-child {
            // padding-top: 20px;
        }
        &:last-child {
            // padding-bottom: 20px;
        }
        &:hover {
            background: #e6e6e6;
        }
    }
    &EmptyText {
        padding: 12px 20px;
    }
    &ItemName {
        font-size: 18px;
        line-height: 24px;
    }
    &ItemComment {
        font-size: 16px;
        line-height: 1;
    }
}
</style>
