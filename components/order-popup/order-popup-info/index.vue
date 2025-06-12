<script setup lang="ts">
import { useConfiguratorStore } from '@/store/configuratorStore'
import { deliveryListItemType } from '@/types/deliveryTypes'
const props = defineProps<{
    deliveryItem: deliveryListItemType | null
}>()
const configuratorStore = useConfiguratorStore()
const selectedStrapPrice = computed(() => {
    return configuratorStore.selectedStrapPrice
})
const selectedStrapPriceWithDiscount = computed(() => {
    return configuratorStore.selectedStrapPriceWithDiscount
})
const usedPromo = computed(() => {
    return configuratorStore.usedPromo
})
</script>

<template>
    <ul :class="s.orderPriceInfo">
        <li :class="s.orderPriceInfoItem">
            <span :class="s.orderPriceInfoItemKey"
                >Ремешок {{ configuratorStore.steps.strap.strapName }}:</span
            >
            <p :class="s.ordertotalPriceValue">
                <span
                    v-if="selectedStrapPrice !== selectedStrapPriceWithDiscount"
                    :class="s.discountAmount"
                >
                    {{
                        `-${usedPromo?.discountValue}${
                            usedPromo?.type === 'percent' ? '%' : ' руб'
                        }`
                    }}
                </span>
                <span
                    :class="[
                        s.orderPriceDefault,
                        {
                            [s.hasDiscount]:
                                selectedStrapPriceWithDiscount !==
                                selectedStrapPrice
                        }
                    ]"
                    >{{ selectedStrapPrice }}</span
                >
                <span
                    v-if="selectedStrapPriceWithDiscount !== selectedStrapPrice"
                    :class="s.orderPriceWithDiscount"
                    >{{ selectedStrapPriceWithDiscount }}</span
                >
                руб.
            </p>
        </li>
        <li
            v-if="configuratorStore.additionalOptionsSum"
            :class="s.orderPriceInfoItem"
        >
            <span :class="s.orderPriceInfoItemKey">Доп опции:</span>
            <p :class="[s.orderPriceInfoItemValue, s.orderPrice]">
                <span :class="[s.orderPriceDefault]">{{
                    configuratorStore.additionalOptionsSum
                }}</span>
                руб.
            </p>
        </li>
        <li
            v-if="props.deliveryItem?.deliveryPrice"
            :class="s.orderPriceInfoItem"
        >
            <p :class="s.orderPriceInfoItemKey">
                {{ props.deliveryItem.deliveryType }}:
            </p>
            <p :class="s.orderPriceInfoItemValue">
                {{ props.deliveryItem.deliveryPrice }} руб.
            </p>
        </li>
    </ul>
</template>

<style lang="scss" module="s">
.orderPriceInfo {
    margin-top: 65px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ccc;
    @media (max-width: 550px) {
        margin-top: 40px;
    }
}
.orderPriceInfoItem {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 17px;
    font-weight: 500;
    color: #7a7a7a;
    line-height: normal;
    letter-spacing: -0.17px;
    margin-bottom: 5px;
    &:last-child {
        margin-bottom: 0;
    }
    @media (max-width: 550px) {
        font-size: 15px;
    }
}
.orderPriceInfoItemKey {
}
.orderPriceInfoItemValue {
    margin-left: 20px;
}
.orderPrice {
    position: relative;
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
