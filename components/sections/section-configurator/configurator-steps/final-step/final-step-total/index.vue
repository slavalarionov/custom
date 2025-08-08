<script setup lang="ts">
import { computed } from 'vue'
import markRightIcon from '@/components/icons/mark-right-icon.vue'
import { useConfiguratorStore } from '@/store/configuratorStore'
const props = defineProps<{
    totalPrice: number | null
    readyDate: string
}>()
const configuratorStore = useConfiguratorStore()
const sharesPrice = computed(() => {
    return Math.round((props.totalPrice && props.totalPrice / 4) || 0) || ''
})
const payFunc = () => {
    emit('pay')
}
const emit = defineEmits(['pay'])
</script>

<template>
    <div :class="s.total">
        <p :class="s.totalPrice">Итого {{ props.totalPrice || '' }}₽</p>
        <div :class="s.totalAdditional">
            <input
                type="text"
                :class="s.totalPromoInput"
                placeholder="Промокод"
                :value="configuratorStore.promoCode"
                @input="
                    configuratorStore.updatePromoCodeValue(
                        ($event.target as HTMLInputElement).value
                    )
                "
            />
            <div :class="s.totalShares">
                <img
                    :class="s.totalSharesImg"
                    src="@/assets/img/shares.jpg"
                    alt=""
                />
                <p :class="s.totalSharesText">
                    4 платежа по
                    {{ sharesPrice }}
                    ₽
                </p>
                <mark-right-icon :class="s.totalSharesIcon" />
            </div>
        </div>
        <primary-btn :class="s.totalPayBtn" :active="true" @click="payFunc">
            Перейти к оформлению
        </primary-btn>
        <div :class="s.stepPayDescription">
            <p :class="s.stepPayDescriptionReadyDate">
                Примерная дата готовности {{ props.readyDate }}.
            </p>
            <p :class="s.stepPayDescriptionText">
                Перед отправкой мы пришлём Вам подробный видеообзор вашего
                ремешка.
            </p>
        </div>
    </div>
</template>

<style lang="scss" module="s">
.total {
    width: 100%;
    max-width: 440px;
    margin: 93px 0 0 auto;
    @media (max-width: 1200px) {
        max-width: 600px;
        margin: 60px auto 0;
    }
}
.totalPrice {
    width: fit-content;
    margin-left: auto;
    font-size: 28px;
    line-height: 1.3em;
    font-weight: 400;
    color: #333;
    @media (max-width: 1200px) {
        margin: 0 auto;
        text-align: center;
        font-size: 24px;
    }
    @media (max-width: 750px) {
        margin: 0 auto;
        text-align: center;
        font-size: 20px;
    }
    @media (max-width: 550px) {
        margin: 0 auto;
        text-align: center;
    }
}
.totalPayBtn {
    margin-top: 32px;
    @media (max-width: 550px) {
        margin: 21px 0 0;
    }
}
.stepPayDescription {
    margin-top: 18px;
    font-weight: 300;
    text-align: center;
}
.stepPayDescriptionReadyDate {
}
.stepPayDescriptionText {
    margin-top: 4px;
}
.totalAdditional {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 20px;
    @media (max-width: 550px) {
        flex-direction: column;
    }
}
.totalPromoInput {
    display: block;
    flex: 1 1 30%;
    max-width: 173px;
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid #d0d0d0;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.1) inset;
    margin-right: 20px;
    @media (max-width: 550px) {
        margin: 0;
    }
}
.totalShares {
    flex: 1 1 60%;
    max-width: 252px;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    padding: 13px;
    border-radius: 4px;
    @media (max-width: 550px) {
        margin: 23px 0 0;
    }
}
.totalSharesText {
    font-size: 14px;
    line-height: 1;
    color: #333333;
    margin-left: 10px;
    font-weight: 500;
}
.totalSharesIcon {
    margin-left: 5px;
    width: 12px;
    height: 15px;
}
</style>
