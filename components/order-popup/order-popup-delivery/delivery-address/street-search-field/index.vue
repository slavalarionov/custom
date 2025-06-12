<script setup lang="ts">
import { ref, type Ref, reactive, type ComputedRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { requiredIf } from '@vuelidate/validators'
import searchField from '@/components/core/search-field/index.vue'
import addressSearchApi from '@/api/addressSearchApi'
import type addressListType from 'types/address'
import type { addressListItemType } from 'types/address'
const props = defineProps<{
    modelValue: string
    cityName: string
    needValidate: boolean
}>()
const emit = defineEmits(['streetFound', 'streetSelect', 'update:modelValue'])
const correctStreetSelectedRule = () =>
    !!selectedMenuItem.value || isSearching.value
const searchMenuItems: Ref<addressListType | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const state = reactive({
    street: ''
})
const rules = {
    street: {
        required: requiredIf(() => props.needValidate),
        correctStreetSelectedRule
    }
}
const v$ = useVuelidate(rules, state)
const isSearching: Ref<boolean> = ref(false)
const requestHandler = (_str: string) => {
    isSearching.value = true
    if (state.street !== '') {
        searchHandler(props.cityName)
    }
}
const searchHandler = async (cityName: string) => {
    if (cityName !== null) {
        isLoading.value = true
        const res = await addressSearchApi(state.street, cityName)
        if (res) {
            if (!res.length) {
                searchMenuItems.value = []
                isLoading.value = false
                return
            }
            searchMenuItems.value = res
            emit('streetFound')
        } else {
            searchMenuItems.value = []
        }
    }
    isLoading.value = false
}
const inputChangeHandler = () => {
    if (!searchMenuItems.value?.length || state.street === '') {
        state.street = ''
    }
    isSearching.value = false
}
const inputHandler = () => {
    isSearching.value = true
}
const searchResultEmpty: ComputedRef<boolean | null> = computed(() => {
    if (searchMenuItems.value) {
        return !(searchMenuItems.value?.length > 0)
    }
    return null
})
const onItemClick = (id: number) => {
    if (searchMenuItems.value) {
        searchMenuItems.value[id].selected = true
        const selectedItem = searchMenuItems.value[id]
        state.street = `${selectedItem.data.street_type} ${selectedItem.data.street}`
    }
}
const selectedMenuItem: ComputedRef<addressListItemType | null> = computed(
    () => {
        const item = searchMenuItems.value?.find(
            (item) =>
                `${item.data.street_type} ${item.data.street}`.toLocaleLowerCase() ===
                state.street.toLocaleLowerCase()
        )
        return item || null
    }
)
watch(selectedMenuItem, (item) => {
    if (item) {
        emit('streetSelect', item)
    }
})
watch(
    () => state.street,
    (value) => {
        emit('update:modelValue', value)
    }
)
watch(
    () => props.cityName,
    (name) => {
        if (name !== '') {
            searchHandler(name)
        } else {
            state.street = ''
            searchMenuItems.value = []
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
        v-model="state.street"
        :is-loading="isLoading"
        title="Улица"
        placeholder="Начните вводить адрес"
        :is-result-empty="searchResultEmpty"
        empty-result-text="По вашему запросу ничего не найдено"
        error-message="Пожалуйста, выберите улицу из списка"
        :is-valid="!(v$.$dirty && v$.street.$error)"
        @field-change="inputChangeHandler"
        @field-input="inputHandler"
        @request-enter="requestHandler"
    >
        <template #menuItems>
            <div
                v-for="(item, idx) in searchMenuItems"
                v-show="item.data.street"
                :key="item.data.street_fias_id"
                :class="s.searchMenuItem"
                @click="onItemClick(idx)"
            >
                <p :class="s.searchMenuItemStreet">
                    {{ `${item.data.street_type} ${item.data.street}` }}
                </p>
                <div :class="s.searchMenuItemFullAddress">
                    {{
                        ` ${
                            item.data.settlement_type
                                ? item.data.settlement_type + '.'
                                : ''
                        }
                            ${
                                item.data.settlement
                                    ? item.data.settlement + ','
                                    : ''
                            }
                        ${
                            item.data.city_with_type &&
                            item.data.city_with_type !==
                                item.data.region_with_type
                                ? item.data.city_with_type + ','
                                : ''
                        } ${
                            item.data.region_with_type
                                ? item.data.region_with_type + ','
                                : ''
                        } ${item.data.country}`
                    }}
                </div>
            </div>
        </template>
    </search-field>
</template>

<style lang="scss" module="s">
.searchMenu {
    &Item {
        cursor: pointer;
        padding: 12px 20px;
        background: #fff;
        transition: 0.2s ease;
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
