<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'
import type deliveryStateType from '../deliveryState'
import deliveryAddress from './delivery-address/index.vue'
import citySearchField from './city-search-field/index.vue'
import pvzSearchField from './pvz-search-field/index.vue'
import deliveryTypesList from './deliveryTypesList'
import { Ref, useRuntimeConfig } from '#imports'
import cdekCalcApi from '@/api/cdekCalcApi'
import deliveryInfoApi from '@/api/deliveryInfoApi'
import { useConfiguratorStore } from '@/store/configuratorStore'
import type deliveryListType from '@/types/deliveryTypes'
import type { deliveryEnumsType } from '@/types/deliveryTypes'
import type { deliveryCitiesListItemType } from '@/types/deliveryCities'
import type { deliveryPointsListItemType } from '@/types/deliveryPoints'
import type selectedDeliverypoint from '@/types/selectedDeliveryPoint'
import type widgetDeliveryPointInfoType from '@/types/cdekWidget'
import type deliveryAddressInfoType from '@/types/deliveryAddressInfo'
const props = defineProps<{
    visible: boolean
    needValidate: boolean
}>()
const emit = defineEmits([
    'chooseDeliveryType',
    'deliveryTypeClear',
    'updateNeedValidate',
    'updateClosestDate',
    'updateState',
    'updateDeliveryPoint',
    'updateDeliveryAddressInfo'
])
const configuratorStore = useConfiguratorStore()
const config = useRuntimeConfig()
const state: deliveryStateType = reactive({
    deliveryCity: '',
    receiver: '',
    mailAddress: '',
    curierAddress: ''
})
const rules = {
    receiver: { required },
    mailAddress: {
        required: requiredIf(
            () =>
                !!deliveryItemSelected.value &&
                deliveryItemSelected.value.value === 'post-office'
        )
    },
    curierAddress: {
        required: requiredIf(
            () =>
                !!deliveryItemSelected.value &&
                deliveryItemSelected.value.value === 'city-courier-delivery'
        )
    }
}

const v$ = useVuelidate(rules, state)
const defaultCity: Ref<string> = ref('Санкт-петербург')
const currentDeliveryPoint: Ref<deliveryPointsListItemType | null> = ref(null)
const hasPostamatPoints: Ref<boolean | null> = ref(null)
const hasUsualDeliveryPoints: Ref<boolean | null> = ref(null)
const mapInstance: Ref<any> = ref(null)
const currentCityLocation: Ref<[number, number] | null> = ref(null)
const deliveryCityPostalCode: Ref<string | null> = ref(null)
const cityChoose: Ref<boolean | null> = ref(null)
const widgetCityName: Ref<string | null> = ref(null)
const canCityChoose: Ref<boolean> = ref(true)
const hasDeliveryPoints: Ref<boolean | null> = ref(false)
const initialLoaded: Ref<boolean> = ref(false)
const deliveryPointsLoaded: Ref<boolean> = ref(false)
const deliveryPricesLoaded: Ref<boolean> = ref(false)
const deliveryPricesLoadErrorText: Ref<string> = ref('')
const needFieldsValidate: Ref<boolean> = ref(false)
const mapReady: Ref<boolean> = ref(false)
const mapNeeded: Ref<boolean> = ref(true)
const mapRef = ref<HTMLDivElement>()
const deliveryList: Ref<deliveryListType> = ref(deliveryTypesList)
const selectedTypeOfDelivery: Ref<deliveryEnumsType | null> = ref(null)

const deliveryInfoLoaded: ComputedRef<boolean> = computed(() => {
    return !!(
        deliveryPointsLoaded.value &&
        deliveryPricesLoaded.value &&
        (mapNeeded.value ? mapReady.value : true) &&
        state.deliveryCity !== ''
    )
})
const mapVisible: ComputedRef<boolean> = computed(() => {
    return (
        props.visible &&
        (mapNeeded.value ? mapReady.value : false) &&
        deliveryInfoLoaded.value &&
        (deliveryItemSelected?.value?.value === 'parcel-locker-omnicdek' ||
            deliveryItemSelected?.value?.value === 'point-delivery')
    )
})
const pvzSearchFieldAvailable: ComputedRef<boolean> = computed(() => {
    if (!deliveryItemSelected.value) return false
    return !!(
        deliveryItemSelected.value.value === 'parcel-locker-omnicdek' ||
        deliveryItemSelected.value.value === 'point-delivery'
    )
})
const deliveryItemSelected = computed(() => {
    return (
        deliveryList.value.find(
            (item) => item.deliveryType === selectedTypeOfDelivery.value
        ) || null
    )
})
const widgetDeliveryPoint: Ref<widgetDeliveryPointInfoType | null> = ref(null)
const widgetDeliveryDataTemp: Ref<widgetDeliveryPointInfoType | null> =
    ref(null)
const selectedDeliveryTypeInfo: Ref<selectedDeliverypoint> = ref({
    name: null,
    address: null,
    workTime: null,
    phone: null,
    addressComment: null,
    selected: false
})
const isPointDeliveryChoosen: ComputedRef<boolean> = computed(() => {
    return selectedDeliveryTypeInfo.value.selected
})
const initMap = () => {
    mapInstance.value = new window.CDEKWidget({
        from: state.deliveryCity || defaultCity.value,
        root: 'delivery-map',
        apiKey: '68a3b2db-c1d5-4932-ade1-1c7d21c3fdc3',
        postal_code: 190000,
        servicePath: config.public.SERVICE_PATH,
        defaultLocation: defaultCity.value,
        tariffs: {
            office: [137]
        },
        hideDeliveryOptions: {
            office: false,
            door: true
        },
        hideFilters: {
            type: true
        },
        onChoose(
            _mode: any,
            _tarif: any,
            address: widgetDeliveryPointInfoType
        ) {
            widgetCityName.value = address.city || ''
            if (
                state.deliveryCity.toLocaleLowerCase() ===
                address.city.toLocaleLowerCase()
            ) {
                widgetDeliveryPoint.value = address
                selectedDeliveryTypeInfo.value.name = address.name
                selectedDeliveryTypeInfo.value.address = address.address
                selectedDeliveryTypeInfo.value.workTime = address.work_time
                selectedDeliveryTypeInfo.value.selected = true
                widgetDeliveryDataTemp.value = null
            } else {
                widgetDeliveryDataTemp.value = address
            }
        },
        onReady() {}
    })
    mapReady.value = true
}
const changeDeliveryTypeHadler = () => {
    for (const key in selectedDeliveryTypeInfo.value) {
        if (key === 'selected') {
            selectedDeliveryTypeInfo.value[key] = false
        } else {
            selectedDeliveryTypeInfo.value[key] = null
        }
    }
    widgetDeliveryPoint.value = null
    currentDeliveryPoint.value = null
}
const numWord = (num: number, words: Array<string>) => {
    num = Math.abs(num) % 100
    num = num % 10
    if (num > 10 && num < 20) return words[2]
    if (num > 1 && num < 5) return words[1]
    if (num === 1) return words[0]
    return words[2]
}
const onCitySelect = ([lon, lat], item: deliveryCitiesListItemType) => {
    if (mapInstance.value) {
        currentCityLocation.value = [lon, lat]
        mapInstance.value.updateLocation([lon, lat])
    } else if (mapNeeded.value) {
        const statement = () =>
            (!mapInstance.value &&
                deliveryItemSelected.value?.value ===
                    deliveryList.value[0].value) ||
            deliveryItemSelected.value?.value === deliveryList.value[1].value
        if (!statement()) {
            mapNeeded.value = false
        } else {
            mapNeeded.value = true
            setTimeout(() => {
                initMap()
                currentCityLocation.value = [lon, lat]
                mapInstance.value.updateLocation([lon, lat])
            }, 1000)
        }
    }
    state.deliveryCity = item.data.city
    deliveryCityPostalCode.value = item.data.postal_code
    getSdekDeliveryPrices(item.data.postal_code)
}
const getSdekDeliveryPrices = async (postalCode: string) => {
    const res = await cdekCalcApi(postalCode)
    if (res) {
        if (res.length) {
            const deliveryPointItem = deliveryList.value[0]
            const deliveryPostamatItem = deliveryList.value[1]
            const deliveryCurierItem = deliveryList.value[2]
            const pointRes = res.find((item) => item.tariffId === 136)
            const deliveryRes = res.find((item) => item.tariffId === 137)
            if (pointRes) {
                deliveryPointItem.deliveryPrice = pointRes.price
                deliveryPointItem.deliveryTime = `от ${
                    pointRes.minDays
                } ${numWord(pointRes.minDays, ['дня', 'дней', 'дней'])}`
                deliveryPostamatItem.deliveryPrice = pointRes.price
                deliveryPostamatItem.deliveryTime = `от ${
                    pointRes.minDays
                } ${numWord(pointRes.minDays, ['дня', 'дней', 'дней'])}`
                hasDeliveryPoints.value = true
            } else {
                hasDeliveryPoints.value = false
            }
            if (!pointRes && deliveryRes) {
                deliveryPointItem.deliveryPrice = Math.round(
                    deliveryRes.price * 0.88
                )
                deliveryPointItem.deliveryTime = `от ${
                    deliveryRes.minDays
                } ${numWord(deliveryRes.minDays, ['дня', 'дней', 'дней'])}`
                deliveryPostamatItem.deliveryPrice = Math.round(
                    deliveryRes.price * 0.88
                )
                deliveryPostamatItem.deliveryTime = `от ${
                    deliveryRes.minDays
                } ${numWord(deliveryRes.minDays, ['дня', 'дней', 'дней'])}`
            }
            if (deliveryRes) {
                deliveryCurierItem.deliveryPrice = deliveryRes.price
                deliveryCurierItem.deliveryTime = `от ${
                    deliveryRes.minDays
                } ${numWord(deliveryRes.minDays, ['дня', 'дней', 'дней'])}`
            }
            deliveryPricesLoaded.value = true
            deliveryPricesLoadErrorText.value = ''
        } else {
            hasDeliveryPoints.value = false
            hasUsualDeliveryPoints.value = false
            hasPostamatPoints.value = false
        }
        selectedTypeOfDelivery.value =
            deliveryList.value.find((item) => item.available)?.deliveryType ||
            null
    } else {
        deliveryPricesLoadErrorText.value =
            'Ошибка при рассчете стоимости доставки, попробуйте открыть форму оформления заказа повторно'
        selectedTypeOfDelivery.value = null
    }
    deliveryPricesLoaded.value = true
}
const onDeliveryAddressUpdate = (item: deliveryAddressInfoType) => {
    emit('updateDeliveryAddressInfo', item)
}
const onPointSelect = (item: deliveryPointsListItemType) => {
    currentDeliveryPoint.value = item
    selectedDeliveryTypeInfo.value.name = item.name
    selectedDeliveryTypeInfo.value.address = item.address
    selectedDeliveryTypeInfo.value.selected = true
    selectedDeliveryTypeInfo.value.phone = item.phone
    selectedDeliveryTypeInfo.value.addressComment = item.addressComment
    selectedDeliveryTypeInfo.value.workTime = item.workTime
    mapInstance.value.updateLocation([item.coordX, item.coordY])
}
const onDeliveryPointClear = () => {
    currentDeliveryPoint.value = null
}
const onWidgetPointUpdate = (item: deliveryPointsListItemType) => {
    onPointSelect(item)
    selectedDeliveryTypeInfo.value.selected = true
}
const onSearchFieldClear = () => {
    state.deliveryCity = ''
    deliveryCityPostalCode.value = null
    selectedTypeOfDelivery.value = ''
    canCityChoose.value = true
    emit('deliveryTypeClear')
}
const onPointsLoadStart = () => {
    deliveryPointsLoaded.value = false
}
const onPointsLoaded = ({
    hasPostamatDeliveryPoints,
    hasUsualDeliveryPoints
}) => {
    hasDeliveryPoints.value = hasUsualDeliveryPoints
    hasPostamatPoints.value = hasPostamatDeliveryPoints
    deliveryList.value[0].available = hasUsualDeliveryPoints
    deliveryList.value[1].available = hasPostamatDeliveryPoints
    deliveryList.value[2].available = !!(
        hasUsualDeliveryPoints || hasPostamatDeliveryPoints
    )
    deliveryPointsLoaded.value = true
}
const onDeliveryPointsChange = (boo: boolean) => {
    hasUsualDeliveryPoints.value = boo
}
const onPostamatDeliveryPointsChange = (boo: boolean) => {
    hasPostamatPoints.value = boo
}
watch(
    () => hasUsualDeliveryPoints.value,
    (boo) => {
        deliveryList.value[0].available = !!boo
    }
)
watch(
    () => state.deliveryCity,
    (str) => {
        if (typeof str !== 'string') return
        deliveryList.value[4].available =
            str.toLocaleLowerCase() === 'санкт-петербург'
        deliveryList.value[5].available =
            str.toLocaleLowerCase() === 'санкт-петербург'
    }
)
watch(
    () => hasPostamatPoints.value,
    (boo) => {
        deliveryList.value[1].available = !!boo
    }
)
watch(
    () => !!(hasUsualDeliveryPoints.value || hasPostamatPoints.value),
    (boo: boolean) => {
        deliveryList.value[2].available = !!boo
    }
)
watch(
    () => deliveryInfoLoaded.value,
    (boo) => {
        canCityChoose.value = true
        cityChoose.value = true
        if (boo) {
            const currentItem = deliveryList.value.find((item) => {
                return item.deliveryType === selectedTypeOfDelivery.value
            })
            if (!(currentItem && currentItem.available)) {
                const availableItem = deliveryList.value.find((item) => {
                    return item.available
                })
                if (availableItem) {
                    selectedTypeOfDelivery.value = availableItem.deliveryType
                }
            }
            const prevDeliveryType = deliveryList.value.find(
                (item) => item.deliveryType === selectedTypeOfDelivery.value
            )
            if (initialLoaded.value && !prevDeliveryType?.available) {
                selectedTypeOfDelivery.value =
                    deliveryList.value.find((item) => item.available)
                        ?.deliveryType || ''
            }
            if (!initialLoaded.value) {
                initialLoaded.value = true
            }
            selectedDeliveryTypeInfo.value.selected = false
        }
    }
)
const onPvzPointSelect = () => {
    if (widgetDeliveryDataTemp.value === null) return
    selectedDeliveryTypeInfo.value.selected = true
    widgetDeliveryPoint.value = widgetDeliveryDataTemp.value
    selectedDeliveryTypeInfo.value.name = widgetDeliveryPoint.value.name
    selectedDeliveryTypeInfo.value.address = widgetDeliveryPoint.value.address
    selectedDeliveryTypeInfo.value.workTime =
        widgetDeliveryPoint.value.work_time
    selectedDeliveryTypeInfo.value.selected = true
}
watch(
    () => selectedDeliveryTypeInfo.value,
    (obj) => {
        emit('updateDeliveryPoint', obj)
    },
    {
        deep: true
    }
)
watch(
    () => state,
    (obj) => {
        emit('updateState', obj)
    },
    {
        deep: true
    }
)
watch(deliveryItemSelected, (item) => {
    selectedDeliveryTypeInfo.value.selected = false
    emit('chooseDeliveryType', item)
    if (
        item?.value === 'parcel-locker-omnicdek' ||
        item?.value === 'point-delivery'
    ) {
        mapNeeded.value = true
        if (!mapInstance.value) {
            initMap()
        }
    }
})
watch(
    () => props.needValidate,
    async (boo: boolean) => {
        if (boo) {
            needFieldsValidate.value = true
            await v$.value.$validate()
            emit('updateNeedValidate', false)
        }
    }
)
watch(
    () => props.visible,
    async (isVisible: boolean) => {
        if (isVisible) {
            if (deliveryCityPostalCode.value) {
                await getSdekDeliveryPrices(deliveryCityPostalCode.value)
            }
            cityChoose.value = !state.deliveryCity && defaultCity.value !== ''
            if (cityChoose.value) {
                canCityChoose.value = false
            }
            emit('chooseDeliveryType', deliveryItemSelected.value)
            configuratorStore.deliveryPrice =
                deliveryItemSelected.value?.deliveryPrice || null
        }
    }
)
onMounted(async () => {
    const res = await deliveryInfoApi()
    if (res) {
        deliveryList.value[3].deliveryType =
            res.deliveryInfo.data.attributes.delivery_mail_data.label
        deliveryList.value[3].deliveryTime =
            res.deliveryInfo.data.attributes.delivery_mail_data.delivery_time
        deliveryList.value[3].deliveryPrice =
            res.deliveryInfo.data.attributes.delivery_mail_data.price
    }
})
</script>

<template>
    <div :class="s.orderDelivery">
        <h4 :class="s.orderDeliveryTitle">Доставка</h4>
        <city-search-field
            v-if="props.visible"
            :is-readonly="!canCityChoose"
            :class="s.searchCityField"
            :default-city="defaultCity"
            :current-city="state.deliveryCity"
            :widget-point-city="widgetCityName"
            :city-choose="cityChoose"
            :need-validate="props.needValidate"
            @city-select="onCitySelect"
            @field-clear="onSearchFieldClear"
            @select-pvz-point="onPvzPointSelect"
        />
        <div
            v-if="
                !deliveryInfoLoaded &&
                !deliveryPricesLoadErrorText &&
                state.deliveryCity
            "
            :class="s.deliveryInfoLoading"
        >
            <data-loader
                :visible="!deliveryInfoLoaded"
                :class="s.dataLoaderSpinner"
                type="small"
                :border-colors="['#cccccc', '#01416D']"
            />
            <p :class="s.deliveryInfoLoadingText">
                Загрузка данных доставки...
            </p>
        </div>
        <p
            v-if="deliveryInfoLoaded && deliveryPricesLoadErrorText"
            :class="s.deliveryError"
        >
            {{ deliveryPricesLoadErrorText }}
        </p>
        <ul
            v-show="deliveryInfoLoaded && !deliveryPricesLoadErrorText"
            :class="s.orderDeliveryList"
        >
            <li
                v-for="(item, idx) in deliveryList"
                v-show="item.available"
                :key="idx"
                :class="[s.orderDeliveryListItem]"
            >
                <radio-button
                    v-model="selectedTypeOfDelivery"
                    name="delivery-type"
                    :value="item.deliveryType"
                >
                    <p :class="s.orderDeliveryListItemType">
                        {{ item.deliveryType }}
                    </p>
                    <p
                        v-if="item.deliveryTime"
                        :class="s.orderDeliveryListItemTime"
                    >
                        &nbsp;{{ item.deliveryTime }}
                    </p>
                    <p
                        v-if="item.deliveryPrice"
                        :class="s.orderDeliveryListItemPrice"
                    >
                        ,
                        {{
                            !item.priceFixed && item.deliveryPrice
                                ? 'от ' + item.deliveryPrice
                                : item.deliveryPrice
                        }}
                        руб.
                    </p>
                </radio-button>
            </li>
        </ul>
        <pvz-search-field
            v-show="
                state.deliveryCity &&
                !isPointDeliveryChoosen &&
                deliveryInfoLoaded &&
                !deliveryPricesLoadErrorText
            "
            :available="pvzSearchFieldAvailable"
            :class="s.getPointField"
            :need-validate="props.needValidate"
            :city-postal-code="deliveryCityPostalCode"
            :widget-delivery-point="widgetDeliveryPoint"
            :delivery-type="deliveryItemSelected"
            :current-delivery-point="currentDeliveryPoint"
            @change-postamat-points="onPostamatDeliveryPointsChange"
            @widget-update-selected-point="onWidgetPointUpdate"
            @change-delivery-points="onDeliveryPointsChange"
            @point-select="onPointSelect"
            @points-loaded="onPointsLoaded"
            @points-load-start="onPointsLoadStart"
            @field-clear="onDeliveryPointClear"
        />
        <div
            v-show="mapVisible && state.deliveryCity && !isPointDeliveryChoosen"
            id="delivery-map"
            ref="mapRef"
            :class="s.orderDeliveryMap"
        ></div>
        <p
            v-if="
                selectedTypeOfDelivery ===
                'Самовывоз с производства в Санкт-Петербурге'
            "
            :class="[s.choiceText, s.selfDeliveryText]"
        >
            По готовности заказа мы согласуем с вами удобное время, когда вы
            сможете забрать заказ у нас на производстве по адресу Масляный
            переулок, 7.
        </p>
        <p
            v-if="
                selectedTypeOfDelivery ===
                'Доставка курьером по Санкт-Петербургу'
            "
            :class="[s.choiceText, s.cityCurierDelivery]"
        >
            Согласуем удобное для вас место и время доставки по готовности
            заказа и доставим Яндекс.Доставкой
        </p>
        <transition name="fade">
            <div v-if="isPointDeliveryChoosen" :class="s.selectedPoint">
                <p :class="s.selectedPointTitle">Пункт получения:</p>
                <p
                    v-if="selectedDeliveryTypeInfo.name"
                    :class="s.selectedPointName"
                >
                    {{ selectedDeliveryTypeInfo.name }}
                </p>
                <p
                    v-if="selectedDeliveryTypeInfo.address"
                    :class="s.selectedPointAddress"
                >
                    {{ `Адрес: ${selectedDeliveryTypeInfo.address}` }}
                </p>
                <p
                    v-if="selectedDeliveryTypeInfo.addressComment"
                    :class="s.selectedPointaddressComment"
                >
                    {{ selectedDeliveryTypeInfo.addressComment }}
                </p>
                <p
                    v-if="selectedDeliveryTypeInfo.workTime"
                    :class="s.selectedPointWorktime"
                >
                    {{ `Время работы: ${selectedDeliveryTypeInfo.workTime}` }}
                </p>
                <p
                    v-if="selectedDeliveryTypeInfo.phone"
                    :class="s.selectedPointphone"
                >
                    {{ `Телефон: ${selectedDeliveryTypeInfo.phone}` }}
                </p>
                <button
                    type="button"
                    :class="s.selectedPointChangeBtn"
                    @click="changeDeliveryTypeHadler"
                >
                    Изменить
                </button>
            </div>
        </transition>
        <input-field
            v-model="state.receiver"
            title="Получатель (ФИО полностью):"
            placeholder="Иванов Иван Иванович"
            mask="A A A"
            mask-tokens="A:[A-Яа-я]:multiple"
            error-message="Пожалуйста, заполните ваше ФИО"
            :is-valid="!(v$.$dirty && v$.receiver.$error)"
            :class="[s.inputField, s.orderClientNameField]"
        />
        <delivery-address
            v-if="
                deliveryItemSelected?.value === 'cdek-door-delivery' &&
                deliveryInfoLoaded &&
                deliveryPointsLoaded
            "
            :city-name="state.deliveryCity"
            :need-validate="
                props.needValidate &&
                deliveryItemSelected?.value === 'cdek-door-delivery'
            "
            @update-delivery-state="onDeliveryAddressUpdate"
        />
        <input-field
            v-if="deliveryItemSelected?.value === 'post-office'"
            v-model="state.mailAddress"
            :class="s.mailDeliveryAddress"
            error-message="Пожалуйста, заполните адрес"
            :is-valid="!(v$.$dirty && v$.mailAddress.$error)"
            title="Адрес"
        />
        <input-field
            v-else-if="deliveryItemSelected?.value === 'city-courier-delivery'"
            v-model="state.curierAddress"
            :class="s.mailDeliveryAddress"
            error-message="Пожалуйста, заполните адрес"
            :is-valid="!(v$.$dirty && v$.curierAddress.$error)"
            title="Адрес"
        />
    </div>
</template>

<style lang="scss" module="s">
.orderDelivery {
    margin: 60px 0 35px;
    @media (max-width: 550px) {
        margin: 30px 0 20px;
    }
}
.deliveryInfoLoading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 35px;
    &Text {
        margin-top: 15px;
    }
}
.orderDeliveryTitle {
    color: #000;
    font-size: 24px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.24px;
    @media (max-width: 750px) {
        font-size: 20px;
    }
    @media (max-width: 550px) {
        font-size: 16px;
    }
}
.searchCityField {
    margin-top: 23px;
}
.mailDeliveryAddress {
    margin-top: 35px;
}
.orderDeliveryList {
    margin-top: 44px;
    @media (max-width: 550px) {
        margin-top: 20px;
    }
}
.orderDeliveryListItem {
    margin-bottom: 13px;
    &:last-child {
        margin-bottom: 0;
    }
    @media (max-width: 400px) {
        margin-bottom: 8px;
    }
}
.orderDeliveryListItemType {
    font-size: 17px;
    line-height: normal;
    font-weight: 500;
    letter-spacing: -0.17px;
    color: #000;
    @media (max-width: 750px) {
        font-size: 15px;
    }
    @media (max-width: 550px) {
        font-size: 13px;
    }
    @media (max-width: 400px) {
        font-size: 12px;
    }
}
.deliveryError {
    margin-top: 1.2rem;
    color: #ff4e4e;
    max-width: 29rem;
}
.orderDeliveryListItemTime {
    font-size: 16px;
    font-weight: 400;
    color: #7f7f7f;
    line-height: normal;
    letter-spacing: -0.16px;
    @media (max-width: 750px) {
        font-size: 14px;
    }
    @media (max-width: 550px) {
        font-size: 13px;
    }
    @media (max-width: 400px) {
        font-size: 12px;
    }
}
.orderDeliveryListItemPrice {
    font-size: 16px;
    font-weight: 400;
    color: #7f7f7f;
    line-height: normal;
    letter-spacing: -0.16px;
    @media (max-width: 750px) {
        font-size: 14px;
    }
    @media (max-width: 550px) {
        font-size: 13px;
    }
    @media (max-width: 400px) {
        font-size: 12px;
    }
}
.getPointField {
    position: relative;
    margin-top: 44px;
    z-index: 100;
    @media (max-width: 550px) {
        margin-top: 20px;
    }
}
.orderDeliveryMap {
    position: relative;
    width: 100%;
    height: 500px;
    margin-top: 40px;
    background: #ccc;
    z-index: 50;
    & > div > div {
        min-height: 100% !important;
    }
    @media (max-width: 550px) {
        height: 400px;
    }
}
.orderClientNameField {
    margin-top: 46px;
    @media (max-width: 550px) {
        margin-top: 20px;
    }
}
.selfDeliveryText {
}
.choiceText {
    font-size: 18px;
    line-height: 20px;
    color: #7f7f7f;
    margin-top: 35px;
    width: 80%;
    @media (max-width: 750px) {
        font-size: 16px;
    }
    @media (max-width: 750px) {
        font-size: 14px;
        line-height: 18px;
        margin-top: 25px;
    }
}
.cityCurierDelivery {
}
.selectedPoint {
    font-size: 16px;
    line-height: normal;
    color: #333;
    margin-top: 45px;
}
.selectedPointTitle {
    font-size: 18px;
    line-height: normal;
}
.selectedPointName {
    margin-top: 15px;
}
.selectedPointAddress {
    margin-top: 5px;
}
.addressComment {
    color: #ccc;
    font-size: 14px;
}
.selectedPointWorktime {
    margin-top: 5px;
}
.selectedPointChangeBtn {
    font-size: 18px;
    line-height: normal;
    columns: #000;
    font-weight: 500;
    transition: 0.2s ease;
    text-decoration: underline;
    &:hover {
        color: #a0a0a0;
    }
}
.dataLoaderSpinner {
    z-index: 10;
}
</style>
