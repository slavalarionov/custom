<script setup lang="ts">
import finalStepMain from './final-step-main/index.vue'
import finalStepAdditional from './final-step-additional/index.vue'
import finalStepTotal from './final-step-total/index.vue'
import { useConfiguratorStore } from '@/store/configuratorStore'
const configuratorStore = useConfiguratorStore()
const totalPrice = computed(() => {
    return configuratorStore.totalPrice
})
const onPay = () => {
    configuratorStore.showOrderPopup()
}
</script>

<template>
    <div :class="s.step">
        <final-step-main :class="s.stepMain" />
        <final-step-additional :class="s.stepAdditional" />
        <final-step-total
            :total-price="totalPrice"
            :class="s.stepTotal"
            :ready-date="configuratorStore.closestReadyDate"
            @pay="onPay"
        />
    </div>
</template>

<style lang="scss" module="s">
.step {
    width: 100%;
    padding-top: 80px;
    @media (max-width: 1200px) {
        padding-top: 60px;
    }
    @media (max-width: 750px) {
        padding-top: 30px;
    }
}
.stepAdditional {
}
.stepTotal {
}
/* @media (max-width: 1400px) {
    .caption-step__option {
        &_name {
            font-size: 22px;
        }
    }
}
@media (max-width: 1200px) {
    .caption-step__option {
        padding: 35px;
        border-radius: 45px;
    }
}
@media (max-width: 1100px) {
    .caption-step {
        justify-content: center;
    }
    .caption-step__additional {
        flex-basis: 100%;
        max-width: 700px;
        margin-top: 48px;
    }
    .caption-step__preview-column {
        flex-basis: 100%;
        max-width: 700px;
    }
    .caption-step__preview {
        min-height: auto;
        width: 100%;
    }
    .caption-step__option {
        &_name,
        &_price {
            font-size: 20px;
        }
    }
}
@media (max-width: 750px) {
    .caption-step__option {
        padding: 30px;
        border-radius: 35px;
        &_name {
            font-size: 18px;
        }
    }
    .caption-step__total {
        margin-top: 68px;
    }
    .caption-step__total_pay-btn {
        margin-top: 24px;
    }
    .caption-step__pay-description_text {
        margin-top: 10px;
    }
}
@media (max-width: 550px) {
    .caption-step__option {
        padding: 20px;
        border-radius: 28px;
        &_name {
            font-size: 18px;
        }
    }
} */
</style>
