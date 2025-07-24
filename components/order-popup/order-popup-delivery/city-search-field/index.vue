<script setup lang="ts">
import { ref, type Ref, type ComputedRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import searchField from '@/components/core/search-field/index.vue'
// import cdekCitiesApi from '@/api/cdekCitiesApi'
import citySearchApi from '@/api/citySearchApi'
import deliveryCitiesListType from '@/types/deliveryCities'
import type { deliveryCitiesListItemType } from '@/types/deliveryCities'
const props = defineProps<{
    defaultCity: string
    cityChoose: boolean | null
    isReadonly?: boolean
    currentCity: string
    widgetPointCity: string | null
    needValidate?: boolean
}>()
const emit = defineEmits(['citySelect', 'fieldClear', 'selectPvzPoint'])
const state = reactive({
    deliveryCity: ''
})
const rules = {
    deliveryCity: { required }
}
const v$ = useVuelidate(rules, state)
const citiesSearchMenuItems: Ref<deliveryCitiesListType | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const initialDataLoaded: Ref<boolean> = ref(false)

const searchHandler = (cityString: string) => {
    getCities(cityString)
}
const getCities = async (cityString: string) => {
    isLoading.value = true
    const res = await citySearchApi(cityString)
    if (res) {
        citiesSearchMenuItems.value = res
    } else {
        citiesSearchMenuItems.value = []
    }
    isLoading.value = false
}
const onFieldChange = () => {
    if (!citiesSearchMenuItems.value?.length) {
        state.deliveryCity = ''
        emit('fieldClear')
    } else if (!citiesSearchMenuItems.value.find((item) => item.selected)) {
        citiesSearchMenuItems.value[0].selected = true
    }
}
const searchResultEmpty: ComputedRef<boolean | null> = computed(() => {
    if (citiesSearchMenuItems.value) {
        return !(citiesSearchMenuItems.value.length > 0)
    }
    return null
})
const onCitiesItemClick = (id: number) => {
    if (citiesSearchMenuItems.value) {
        citiesSearchMenuItems.value.forEach((item, idx) => {
            item.selected = idx === id
            if (item.selected) {
                state.deliveryCity = item.data.city
            }
        })
    }
}
const selectedMenuItem: ComputedRef<deliveryCitiesListItemType | null> =
    computed(() => {
        if (citiesSearchMenuItems.value?.length) {
            return (
                citiesSearchMenuItems.value.find((item) => item.selected) ||
                null
            )
        }
        return null
    })
watch(selectedMenuItem, (item) => {
    if (item) {
        emit('citySelect', [item.data.geo_lon, item.data.geo_lat], item)
    }
})
/* watch(
    () => props.cityChoose && props.defaultCity,
    async (boo) => {
        if (boo && props.defaultCity && !popupLoadedOnce.value) {
            state.deliveryCity = props.defaultCity
            popupLoadedOnce.value = true
            // const res = await cdekCitiesApi(props.defaultCity)
            const res = await citySearchApi(props.defaultCity)
            if (res) {
                if (res.length) {
                    citiesSearchMenuItems.value = res
                    emit(
                        'citySelect',
                        [
                            citiesSearchMenuItems.value[0].data.geo_lon,
                            citiesSearchMenuItems.value[0].data.geo_lat
                        ],
                        citiesSearchMenuItems.value[0]
                    )
                } else {
                    emit('fieldClear')
                }
            } else {
                citiesSearchMenuItems.value = []
            }
            initialDataLoaded.value = true
        }
    }
) */
watch(
    () => props.defaultCity,
    (city: string) => {
        state.deliveryCity = city
    }
)
watch(
    () => props.widgetPointCity,
    (city: string | null) => {
        if (city) {
            state.deliveryCity = city
            getCity(city)
        }
    }
)
watch(
    () => props.needValidate,
    (bool: boolean) => {
        if (bool) {
            v$.value.$validate()
        }
    }
)
async function getCity(cityName: string, setPVZPointSelected: boolean = false) {
    const res = await citySearchApi(cityName)
    if (res) {
        if (res.length) {
            citiesSearchMenuItems.value = res
            emit(
                'citySelect',
                [
                    citiesSearchMenuItems.value[0].data.geo_lon,
                    citiesSearchMenuItems.value[0].data.geo_lat
                ],
                citiesSearchMenuItems.value[0]
            )
            if (setPVZPointSelected) {
                emit('selectPvzPoint')
            }
        } else {
            emit('fieldClear')
        }
    } else {
        citiesSearchMenuItems.value = []
    }
    initialDataLoaded.value = true
}
onMounted(() => {
    if (!props.currentCity) {
        state.deliveryCity = props.defaultCity
        getCity(props.defaultCity)
    } else {
        state.deliveryCity = props.currentCity
    }
})
</script>

<template>
    <search-field
        v-model="state.deliveryCity"
        :is-loading="isLoading && initialDataLoaded"
        title="Город:"
        placeholder="Чебоксары, Чувашская Республика"
        empty-result-text="Город не найден"
        :is-result-empty="searchResultEmpty"
        :readonly="props.isReadonly"
        error-message="Пожалуйста, выберете город"
        :is-valid="!(v$.$dirty && v$.deliveryCity.$error)"
        @request-enter="searchHandler"
        @field-change="onFieldChange"
    >
        <template #menuItems>
            <div
                v-for="(item, idx) in citiesSearchMenuItems"
                :key="item.data.fias_id"
                :class="s.searchMenuItem"
                @click="onCitiesItemClick(idx)"
            >
                <p :class="s.searchMenuItemName">
                    {{ item.data.city || item.data.settlement }}
                </p>
                <div :class="s.searchMenuItemOther">
                    <div
                        v-if="
                            item.data.region_with_type &&
                            item.data.city !== item.data.region_with_type
                        "
                        :class="s.searchMenuItemRegion"
                    >
                        {{ item.data.region_with_type + ',' }}&nbsp;
                    </div>
                    <div
                        v-if="item.data.area_with_type"
                        :class="s.searchMenuItemRegion"
                    >
                        {{ item.data.area_with_type + ',' }}&nbsp;
                    </div>
                    <div :class="s.searchMenuItemCountry">
                        {{ item.data.country }}
                    </div>
                </div>
            </div>
        </template>
    </search-field>
</template>

<style lang="scss" module="s">
.fieldWrapper {
    position: relative;
    z-index: 200;
}
.inputField {
}
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
    &ItemOther {
        display: flex;
        align-items: center;
    }
    &ItemSubRegion {
        font-size: 14px;
        line-height: 1;
    }
    &ItemRegion {
        font-size: 16px;
        line-height: 1;
    }
    &ItemCountry {
        font-size: 16px;
        line-height: 1;
    }
}
</style>
