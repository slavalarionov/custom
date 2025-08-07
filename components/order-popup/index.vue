<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import type deliveryStateType from './deliveryState'
import orderPopupProduct from './order-popup-product/index.vue'
import orderPopupInfo from './order-popup-info/index.vue'
import orderPopupPaymentType from './order-popup-payment-type/index.vue'
import fillFormData from './fillFormData'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { ComputedRef, useNuxtApp } from '#imports'
import inputField from '@/components/UI/input-field.vue'
import checkboxButton from '@/components/UI/checkbox-button.vue'
import crossIcon from '@/components/icons/cross-icon.vue'
import primaryBtn from '@/components/UI/primary-btn.vue'
import promoCodeApi from '@/api/promoCodeApi'
import sendEmailApi from '@/api/sendEmailApi'
import sendRetailCrmApi from '@/api/sendRetailCrmApi'
import sendTelegramMessageApi from '@/api/sendTelegramMessageApi'
import type { deliveryListItemType } from '@/types/deliveryTypes'
import type selectedDeliveryPoint from '@/types/selectedDeliveryPoint'
import type deliveryAddressInfoType from '@/types/deliveryAddressInfo'
import createOrderApi from '@/api/createOrderApi'
const configuratorStore = useConfiguratorStore()
const { $lockScroll, $unlockScroll } = useNuxtApp()
const popupVisible = computed(() => {
    return configuratorStore.orderPopupVisible
})
const telLengthValidate = (value: string) => {
    return value.replace(/[^0-9]/g, '').length === 11
}
const state = reactive({
    email: '',
    tel: '',
    deliveryCity: '',
    receiver: '',
    mailAddress: '',
    curierAddress: '',
    deliveryComment: '',
    deliveryPromoCode: '',
    selectedTypeOfPayment: 'Банковской картой'
})
const rules = {
    email: { required, email },
    tel: { required, telLengthValidate }
}
const v$ = useVuelidate(rules, state)
const rememberFormData: Ref<boolean> = ref(false)
const promoLoading: Ref<boolean> = ref(false)
const promoResultTextVisible: Ref<boolean> = ref(false)
const promoBtnVisible: Ref<boolean> = ref(false)
const deliveryPoint: Ref<selectedDeliveryPoint | null> = ref(null)
const deliveryAddressInfo: Ref<deliveryAddressInfoType | null> = ref(null)
const needValidate: Ref<boolean> = ref(false)
const promoResultText: Ref<string> = ref('')
const isFormDataCorrect: ComputedRef<boolean> = computed(() => {
    return v$.value.$dirty && !v$.value.$errors.length && !!deliveryItem.value
})
const deliveryItem: Ref<deliveryListItemType | null> = ref(null)
const modelStep = computed(() => {
    return configuratorStore.steps.model
})
const strapStep = computed(() => {
    return configuratorStore.steps.strap
})
const designStep = computed(() => {
    return configuratorStore.steps.strapDesign
})
const finalStep = computed(() => {
    return configuratorStore.steps.final
})
const totalPrice = computed(() => {
    return configuratorStore.totalPrice
})
const totalPriceWithDiscount = computed(() => {
    return configuratorStore.totalPriceWithDiscount
})
const onDeliveryTypeChoose = (item: deliveryListItemType) => {
    deliveryItem.value = item
}
const onDeliveryTypeClear = () => {
    deliveryItem.value = null
}
const closeOrderPopup = () => {
    configuratorStore.closeOrderPopup()
}
watch(
    () => deliveryItem.value,
    (item) => {
        configuratorStore.deliveryPrice = item?.deliveryPrice || 0
    },
    {
        deep: true
    }
)
const checkPromo = async () => {
    if (!state.deliveryPromoCode) {
        configuratorStore.promoUse(null)
        return
    }
    promoLoading.value = true
    const res = await promoCodeApi(state.deliveryPromoCode)
    promoLoading.value = false
    if (!(res instanceof Error) && res?.promoFound) {
        promoResultText.value = 'Промокод применен'
        configuratorStore.promoUse(res)
    } else {
        configuratorStore.promoUse(null)
        promoResultText.value = 'Промокод отклонен'
    }
    promoBtnVisible.value = false
    promoResultTextVisible.value = true
}
watch(
    () => configuratorStore.promoCode,
    (value) => {
        configuratorStore.promoAccepted = false
        promoResultTextVisible.value = false
        promoBtnVisible.value = true
        state.deliveryPromoCode = value || ''
    }
)
watch(
    () => popupVisible.value,
    (boo: boolean) => {
        if (boo) {
            if (!configuratorStore.promoAccepted) {
                promoBtnVisible.value = true
                promoResultTextVisible.value = false
            }
            $lockScroll()
            configuratorStore.deliveryPrice =
                deliveryItem.value?.deliveryPrice || 0
        } else {
            $unlockScroll()
        }
    }
)
watch(
    () => state.email,
    (value) => {
        configuratorStore.steps.final.email = value
    }
)
watch(
    () => state.tel,
    (value) => {
        configuratorStore.steps.final.phone = '+' + value.replace(/\D/g, '')
    }
)
watch(
    () => state.receiver,
    (value) => {
        configuratorStore.steps.final.name = {
            lastName: value.split(' ')[0] || '',
            firstName: value.split(' ')[1] || '',
            middleName: value.split(' ')[2] || ''
        }
    }
)
const onDeliveryStateUpdate = (delState: deliveryStateType) => {
    state.deliveryCity = delState.deliveryCity
    state.curierAddress = delState.curierAddress
    state.mailAddress = delState.mailAddress
    state.receiver = delState.receiver
}
const onDeliveryPointUpdate = (point: selectedDeliveryPoint) => {
    deliveryPoint.value = point
}
const onDeliveryAddressUpdate = (info: deliveryAddressInfoType) => {
    deliveryAddressInfo.value = info
}
function generateOrderNumber(length: number) {
    let res = ''
    for (let i = 0; i < length; ++i) {
        res += Math.floor(Math.random() * 10)
    }
    configuratorStore.orderNumber = res
    return res
}

async function getPaymentLink(options: any) {
    const config = useRuntimeConfig()
    const response = await createOrderApi(config, {
        amount: String(options.totalPrice),
        purpose: 'Оплата заказа',
        paymentMode: ['sbp', 'card', 'tinkoff'],
        redirectUrl: 'https://slavalarionov.com/success'
    })
    const link = response?.data?.Data?.paymentLink
    return link
}

const onPay = async () => {
    const popup = window.open('', '_blank')

    needValidate.value = true
    await v$.value.$validate()
    if (isFormDataCorrect.value) {

        const options = {
            orderNumber: generateOrderNumber(10),
            strapModel: strapStep.value.strapName || '',
            strapLeatherColor:
                designStep.value.leatherColor.name || 'Не выбран',
            appleWatchModel: modelStep.value.modelName || '',
            appleWatchModelSize: modelStep.value.modelSize + 'мм' || '',
            appleWatchModelColor: modelStep.value.color.name || 'Не выбран',
            stitchingColor:
                designStep.value.stitchingColor.title || 'Не выбран',
            edgeColor: designStep.value.edgeColor.title || 'Не выбран',
            buckleColor: designStep.value.buckleColor.title || 'Не выбран',
            adapterColor: designStep.value.adapterColor.title || 'Не выбран',
            initials: {
                choosen: finalStep.value.additionalOptions.initials.choosen,
                text: finalStep.value.additionalOptions.initials.text
            },
            presentBox: {
                choosen: finalStep.value.additionalOptions.presentBox.choosen
            },
            postCard: {
                choosen: finalStep.value.additionalOptions.postCard.choosen,
                text: finalStep.value.additionalOptions.postCard.text
            },
            buckleButterfly: {
                available:
                    !!configuratorStore.selectedStrapModel?.attributes
                        .watch_strap.has_buckle_butterfly,
                choosen: designStep.value.buckleButterflyChoosen
            },
            receiverFullname: state.receiver,
            email: state.email,
            tel: state.tel,
            deliveryCity: state.deliveryCity,
            deliveryType: deliveryItem.value?.deliveryType || '',
            deliveryPoint: deliveryPoint.value,
            deliveryAddressInfo: deliveryAddressInfo.value,
            mailAddress: state.mailAddress,
            curierAddress: state.curierAddress,
            deliveryComment: state.deliveryComment,
            productsPrice: configuratorStore.selectedStrapPrice,
            additionalOptionsPrice: configuratorStore.additionalOptionsSum,
            deliveryPrice: deliveryItem.value?.deliveryPrice,
            promo: finalStep.value.promo,
            totalPrice: configuratorStore.totalPriceWithDiscount,
            paymentType: state.selectedTypeOfPayment
        }

        const link = await getPaymentLink(options)

        popup!.location.href = link!

        // Остальная логика
        const config = useRuntimeConfig()
        await sendRetailCrmApi(config, options)
        await sendTelegramMessageApi(config, options)
        const formData = fillFormData(options)
        sendEmailApi(formData)

        configuratorStore.closeOrderPopup()

    }
}
</script>

<template>
    <transition name="fade">
        <div
            v-if="configuratorStore.steps.strapDesign.isChoosen"
            v-show="popupVisible"
            :class="s.order"
        >
            <div :class="s.orderContent">
                <button :class="s.closeOrderPopupBtn" @click="closeOrderPopup">
                    <cross-icon :class="s.closeOrderPopupBtnIcon" />
                </button>
                <h3 :class="s.orderTitle">Ваш заказ:</h3>
                <div :class="s.orderProducts">
                    <order-popup-product />
                </div>
                <p :class="s.orderProductsSum">
                    Сумма: {{ configuratorStore.productsPrice }} руб.
                </p>
                <div :class="s.orderContacts">
                    <input-field
                        v-model="state.email"
                        title="E-mail:"
                        placeholder="example@site.com"
                        :error-message="
                            v$.email.$model.length > 0
                                ? 'Пожалуйста, введите корректный email'
                                : 'Пожалуйста, введите email'
                        "
                        :is-valid="!(v$.$dirty && v$.email.$error)"
                        :class="s.inputField"
                    />
                    <input-field
                        v-model="state.tel"
                        title="Телефон:"
                        placeholder="+7 (999) 999-99-99"
                        mask="+7 (###) ###-##-##"
                        :error-message="
                            v$.tel.$model.length > 0
                                ? 'Пожалуйста, ввежите полный номер телефона'
                                : 'Пожалуйста, введите номер телефона'
                        "
                        :is-valid="!(v$.$dirty && v$.tel.$error)"
                        :class="s.inputField"
                    />
                </div>
                <order-popup-delivery
                    v-model:need-validate="needValidate"
                    :visible="popupVisible"
                    @choose-delivery-type="onDeliveryTypeChoose"
                    @delivery-type-clear="onDeliveryTypeClear"
                    @update-state="onDeliveryStateUpdate"
                    @update-delivery-point="onDeliveryPointUpdate"
                    @update-delivery-address-info="onDeliveryAddressUpdate"
                />
                <input-field
                    v-model="state.deliveryComment"
                    title="Комментарий к заказу:"
                    placeholder="Например, обхват запястья"
                    :class="[s.inputField, s.orderCommentField]"
                />
                <div :class="s.promoWrapper">
                    <input-field
                        v-model="state.deliveryPromoCode"
                        title="Промокод"
                        :class="[s.inputField, s.orderPromoCodeField]"
                        @update:model-value="
                            configuratorStore.updatePromoCodeValue
                        "
                    />
                    <div :class="s.promoControls">
                        <data-loader
                            :visible="promoLoading"
                            :class="s.promoLoader"
                            :type="'small'"
                        />
                        <transition name="fade">
                            <primary-btn
                                v-if="
                                    state.deliveryPromoCode && promoBtnVisible
                                "
                                :active="true"
                                :class="s.promoUseBtn"
                                @click="checkPromo"
                                >Применить</primary-btn
                            >
                        </transition>
                        <transition name="fade">
                            <p
                                v-if="promoResultText && promoResultTextVisible"
                                :class="[
                                    s.promoResultText,
                                    {
                                        [s.promoAccepted]:
                                            configuratorStore.promoAccepted,
                                        [s.promoDeclined]:
                                            !configuratorStore.promoAccepted
                                    }
                                ]"
                            >
                                {{ promoResultText }}
                            </p>
                        </transition>
                    </div>
                </div>
                <checkbox-button
                    v-model="rememberFormData"
                    name="remember-data"
                    :class="s.orderRememberDataCheckbox"
                >
                    <p :class="s.orderRememberDataCheckboxText">
                        Запомнить эти контакты в браузере для повторной покупки
                    </p>
                </checkbox-button>
                <p
                    v-if="!isFormDataCorrect && v$.$dirty"
                    :class="s.orderErrorMessage"
                >
                    Пожалуйста, заполните все обязательные поля
                </p>
                <order-popup-info :delivery-item="deliveryItem" />
                <div :class="s.ordertotalPrice">
                    <p :class="s.ordertotalPriceTitle">Итого:</p>
                    <p :class="s.ordertotalPriceValue">
                        <span
                            :class="[
                                s.orderPriceDefault,
                                {
                                    [s.hasDiscount]:
                                        totalPriceWithDiscount !== totalPrice
                                }
                            ]"
                            >{{ totalPrice }}</span
                        >
                        <span
                            v-if="totalPriceWithDiscount !== totalPrice"
                            :class="s.orderPriceWithDiscount"
                            >{{ totalPriceWithDiscount }}</span
                        >
                        руб.
                    </p>
                </div>
                <div :class="s.orderDescription">
                    <p :class="s.orderDescriptionText">
                        Примерная дата готовности:
                        <span>{{ configuratorStore.closestReadyDate }}</span>
                    </p>
                    <p :class="s.orderDescriptionText">
                        Перед отправкой мы пришлём вам подробный видеообзор
                        вашего ремешка.
                    </p>
                </div>
                <primary-btn
                    :class="s.orderPayBtn"
                    :active="true"
                    @click="onPay"
                    >Оплатить заказ</primary-btn
                >
                <p :class="s.orderPolicy">
                    Нажимая на “Оплатить заказ”, вы соглашаетесь с
                    <a
                        href="https://slavalarionov.com/slavalarionovstore/policy"
                        >политикой конфиденциальности</a
                    >.
                </p>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" module="s">
.order {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    z-index: 200;
    overflow-y: auto;
    padding: 50px 30px;
    @media (max-width: 550px) {
        padding: 30px 10px;
    }
    @media (max-width: 360px) {
        padding: 20px 5px;
    }
}
.orderContent {
    position: relative;
    width: 100%;
    max-width: 720px;
    background: #fff;
    padding: 45px 38px;
    margin: auto;
    @media (max-width: 550px) {
        padding: 40px 20px;
    }
    @media (max-width: 550px) {
        padding: 30px 15px;
    }
    @media (max-width: 360px) {
        padding: 20px 13px;
    }
}
.closeOrderPopupBtn {
    position: absolute;
    top: 25px;
    right: 37px;
    width: 24px;
    height: 24px;
    &:hover {
        .closeOrderPopupBtnIcon {
            & path {
                fill: $secondary-color;
            }
        }
    }
    &Icon {
        width: 100%;
        height: 100%;
    }
    @media (max-width: 550px) {
        right: 15px;
        top: 15px;
    }
}
.orderTitle {
    font-size: 24px;
    line-height: normal;
    font-weight: 500;
    color: #000;
    @media (max-width: 550px) {
        font-size: 20px;
    }
    @media (max-width: 360px) {
        font-size: 18px;
    }
}
.orderProducts {
    margin-top: 20px;
}
.orderProductsSum {
    padding-top: 23px;
    text-align: right;
    font-size: 18px;
    font-weight: 500;
    color: #000;
    @media (max-width: 550px) {
        font-size: 16px;
        padding-top: 15px;
    }
}
.inputField {
    margin-bottom: 35px;
    &:last-child {
        margin-bottom: 0;
    }
    @media (max-width: 550px) {
        margin-bottom: 20px;
    }
}
.orderRememberDataCheckbox {
    &Text {
        margin-left: 10px;
        @media (max-width: 550px) {
            font-size: 14px;
            line-height: 1.2;
            max-width: 280px;
        }
    }
}
.orderErrorMessage {
    font-size: 20px;
    padding: 20px;
    background: rgb(255, 59, 59);
    color: #fff;
    margin-top: 45px;
    border-radius: 12px;
}
.ordertotalPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 17px;
    font-style: normal;
    font-weight: 500;
    color: #000;
    line-height: normal;
    letter-spacing: -0.17px;
    margin-top: 16px;
    @media (max-width: 550px) {
        font-size: 16px;
    }
}
.orderDescription {
    margin-top: 25px;
}
.orderDescriptionText {
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    & span {
        color: #0071be;
        font-weight: 400;
    }
    @media (max-width: 550px) {
        font-size: 14px;
        line-height: 1.4;
    }
}
.orderPayBtn {
    width: 100%;
    max-width: none;
    margin-top: 32px;
}
.orderPolicy {
    margin-top: 23px;
    font-size: 16px;
    font-weight: 300;
    color: #7a7a7a;
    & a {
        color: #333333;
        text-decoration: underline;
    }
    @media (max-width: 550px) {
        font-size: 14px;
        line-height: normal;
    }
}
.promoWrapper {
    position: relative;
    margin-bottom: 35px;
}
.promoLoader {
    // position: absolute;
    // top: 50%;
    // right: 140px;
    // transform: translate(0, -50%);
}
.promoControls {
    // position: relative;
    width: fit-content;
    min-width: 180px;
    min-height: 50px;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
}
.orderPromoCodeField {
    margin-bottom: 0;
}
.promoUseBtn {
    width: fit-content;
    padding: 15px 20px;
    margin-left: auto;
}
.promoResultText {
    position: absolute;
    top: 50%;
    right: 0;
    font-size: 16px;
    transform: translate(0, -50%);
    line-height: normal;
    &.promoAccepted {
        color: rgb(0, 168, 0);
    }
    &.promoDeclined {
        color: rgb(255, 49, 49);
    }
}
.orderPriceDefault {
    &.hasDiscount {
        position: relative;
        // color: $secondary-color;
        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(20deg);
            width: 120%;
            height: 1px;
            background: #7a7a7a;
            // background: green;
            z-index: 10;
        }
    }
}
.orderPriceWithDiscount {
    margin-left: 7px;
}
.orderPriceDefault {
}
.hasDiscount {
}
.discountAmount {
    color: $secondary-color;
    color: rgb(255, 49, 49);
    margin-right: 10px;
}
</style>
