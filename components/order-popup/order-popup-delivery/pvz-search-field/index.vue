<script setup lang="ts">
import { ref, type Ref, type ComputedRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { requiredIf } from '@vuelidate/validators'
import searchField from '@/components/core/search-field/index.vue'
import cdekPvzApi from '@/api/cdekPvzApi'
import type deliveryPointsListType from '@/types/deliveryPoints'
import type { deliveryPointsListItemType } from '@/types/deliveryPoints'
import type { deliveryListItemType } from '@/types/deliveryTypes'
import type widgetDeliveryPointInfoType from '@/types/cdekWidget'
const props = defineProps<{
    cityPostalCode: string | null
    deliveryType: deliveryListItemType | null
    available: boolean
    widgetDeliveryPoint: widgetDeliveryPointInfoType | null
    needValidate: boolean
    currentDeliveryPoint: any
}>()
const emit = defineEmits([
    'pointSelect',
    'widgetUpdateSelectedPoint',
    'pointsLoadStart',
    'pointsLoaded',
    'changePostamatPoints',
    'changeDeliveryPoints',
    'fieldClear'
])
const correctPointSelectedRule = () =>
    props.available ? selectedMenuItem.value || isSearching.value : true
const state = reactive({
    pvzPointValue: ''
})
const rules = {
    pvzPointValue: {
        required: requiredIf(() => props.available),
        correctPointSelectedRule
    }
}
const v$ = useVuelidate(rules, state)
const isSearching: Ref<boolean> = ref(false)
const pointsSearchMenuItems: Ref<deliveryPointsListType | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const requestHandler = (str: string) => {
    state.pvzPointValue = str
}
const inputHandler = () => {
    isSearching.value = true
}
const inputChangeHandler = () => {
    isSearching.value = false
    if (!filteredMenuItems.value?.length || state.pvzPointValue === '') {
        state.pvzPointValue = ''
        emit('fieldClear')
    }
}
const searchHandler = async (code: string) => {
    if (code !== null) {
        isLoading.value = true
        emit('pointsLoadStart')
        const res = await cdekPvzApi(code)
        if (res) {
            pointsSearchMenuItems.value = res
        } else {
            pointsSearchMenuItems.value = []
        }
        emit('pointsLoaded', {
            hasPostamatDeliveryPoints: hasPostamatDeliveryPoints.value,
            hasUsualDeliveryPoints: hasDeliveryPoints.value
        })
        isLoading.value = false
    }
}
const deliveryType = computed(() => {
    return props.deliveryType
})
const requirePostamat = computed(() => {
    return deliveryType.value?.value === 'parcel-locker-omnicdek'
})
const requirePointDelivery = computed(() => {
    return deliveryType.value?.value === 'point-delivery'
})
const hasDeliveryPoints = computed(() => {
    if (pointsSearchMenuItems.value) {
        return !!pointsSearchMenuItems.value?.find(
            (item) =>
                item.name.toLocaleLowerCase().includes('постамат') === false
        )
    }
    return null
})
const hasPostamatDeliveryPoints = computed(() => {
    if (pointsSearchMenuItems.value) {
        return !!pointsSearchMenuItems.value?.find((item) =>
            item.name.toLocaleLowerCase().includes('постамат')
        )
    }
    return null
})
const filteredMenuItems: ComputedRef<deliveryPointsListType | null> = computed(
    () => {
        if (pointsSearchMenuItems.value) {
            const res: deliveryPointsListType = []
            const value = state.pvzPointValue.toLocaleLowerCase()
            for (const item of pointsSearchMenuItems.value) {
                const includesName = item.name
                    .toLocaleLowerCase()
                    .includes(value)
                const includesAddress = item.address
                    .toLocaleLowerCase()
                    .includes(value)
                const itemValid = requirePostamat.value
                    ? item.name.toLocaleLowerCase().includes('постамат')
                    : requirePointDelivery.value
                    ? item.name.toLocaleLowerCase().includes('постамат') ===
                      false
                    : true
                if ((includesName || includesAddress) && itemValid) {
                    res.push(item)
                }
            }
            return res
        }
        return null
    }
)
const selectedMenuItem: ComputedRef<deliveryPointsListItemType | null> =
    computed(() => {
        const item = filteredMenuItems.value?.find(
            (item) => item.name === state.pvzPointValue
        )
        return item || null
    })

const searchResultEmpty: ComputedRef<boolean | null> = computed(() => {
    if (pointsSearchMenuItems.value) {
        return !(pointsSearchMenuItems.value.length > 0)
    }
    return null
})
const onItemClick = (item: deliveryPointsListItemType) => {
    if (filteredMenuItems.value) {
        state.pvzPointValue = item.name
        state.pvzPointValue = item.name
        emit('pointSelect', item)
    }
}
watch(
    () => hasDeliveryPoints.value,
    (boo) => {
        emit('changeDeliveryPoints', boo)
    }
)
watch(
    () => hasPostamatDeliveryPoints.value,
    (boo) => {
        emit('changePostamatPoints', boo)
    }
)
watch(
    () => props.cityPostalCode,
    (code) => {
        state.pvzPointValue = ''
        state.pvzPointValue = ''
        if (code) {
            pointsSearchMenuItems.value = null
            searchHandler(code)
        }
    }
)
watch(
    () => deliveryType.value,
    () => {
        state.pvzPointValue = ''
        state.pvzPointValue = ''
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
watch(
    () => props.widgetDeliveryPoint,
    async (point) => {
        if (point) {
            state.pvzPointValue = point.name
            state.pvzPointValue = point.name
            isLoading.value = true
            const res = await cdekPvzApi(point.postal_code)
            if (res) {
                pointsSearchMenuItems.value = res
                const item = filteredMenuItems.value?.find(
                    (item) => item.postalCode === point.postal_code
                )
                if (item) {
                    emit('widgetUpdateSelectedPoint', item)
                }
            } else {
                pointsSearchMenuItems.value = []
            }
            isLoading.value = false
        }
    }
)
watch(
    () => props.currentDeliveryPoint,
    (point) => {
        if (point === null) {
            state.pvzPointValue = ''
        }
    }
)
</script>

<template>
    <search-field
        v-if="pointsSearchMenuItems?.length && props.available"
        v-model="state.pvzPointValue"
        :is-loading="isLoading"
        title="Пункт получения:"
        placeholder="Выберите пункт получения"
        empty-result-text="Результат пуст"
        :is-result-empty="searchResultEmpty"
        :is-valid="!(v$.$dirty && v$.pvzPointValue.$error && props.available)"
        error-message="Пожалуйста, выберите пункт получения"
        type="filter"
        @request-enter="requestHandler"
        @field-input="inputHandler"
        @field-change="inputChangeHandler"
    >
        <template #menuItems>
            <div
                v-for="item in filteredMenuItems"
                :key="item.code"
                :class="s.searchMenuItem"
                @click="onItemClick(item)"
            >
                <p :class="s.searchMenuItemName">
                    {{ item.name }}
                </p>
                <div :class="s.searchMenuItemAddress">{{ item.address }}</div>
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
