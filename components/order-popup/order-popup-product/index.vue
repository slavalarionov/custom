<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/store/configuratorStore'
import previewItem from '@/components/common/preview-item/index.vue'

const configuratorStore = useConfiguratorStore()
const productTitle = computed(() => {
    return `${strapStep.value.strapName} / ${designStep.value.leatherColor.name}`
})
const selectedStrapModel = computed(() => {
    return configuratorStore.selectedStrapModel
})
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
</script>

<template>
    <div :class="s.product">
        <div :class="s.productMain">
            <preview-item :class="s.previewItem" :view="1" />
            <div :class="s.productInfo">
                <h4 :class="s.productName">{{ productTitle }}</h4>
                <ul :class="s.productInfoList">
                    <li :class="s.productInfoListItem">
                        Размер корпуса Apple Watch:
                        {{ modelStep.modelSize + 'mm' }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Цвет адаптеров (крепление к часам):
                        {{ designStep.adapterColor.title || 'Не выбран' }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Цвет пряжки (застежки):
                        {{ designStep.buckleColor.title || 'Не выбран' }}
                    </li>
                    <li
                        v-if="
                            selectedStrapModel?.attributes.watch_strap
                                .has_buckle_butterfly
                        "
                        :class="s.productInfoListItem"
                    >
                        Вид пряжки:
                        {{
                            designStep.buckleButterflyChoosen
                                ? 'Пряжка бабочка'
                                : 'Стандартная'
                        }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Цвет строчки:
                        {{ designStep.stitchingColor.title || 'в тон' }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Цвет края:
                        {{ designStep.edgeColor.title || 'в тон' }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Нанести инициалы?:
                        {{
                            finalStep.additionalOptions.initials.choosen
                                ? `да (+${finalStep.additionalOptions.initials.price}р)`
                                : 'нет'
                        }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Нужна подарочная упаковка?:
                        {{
                            finalStep.additionalOptions.presentBox.choosen
                                ? `да (+${finalStep.additionalOptions.presentBox.price}р)`
                                : 'нет'
                        }}
                    </li>
                    <li :class="s.productInfoListItem">
                        Нужна открытка?:
                        {{
                            finalStep.additionalOptions.postCard.choosen
                                ? `да (+${finalStep.additionalOptions.postCard.price}р)`
                                : 'нет'
                        }}
                    </li>
                </ul>
            </div>
        </div>
        <div :class="s.productAmountInfo">
            <div :class="s.productTotalPrice">
                {{ configuratorStore.productsPrice }} руб.
            </div>
        </div>
    </div>
</template>

<style lang="scss" module="s">
.product {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    &:last-child {
        border-bottom: 1px solid #ccc;
    }
    padding: 20px 0;
    &.productAdditional {
        padding: 16px 0;
    }
}
.previewItem {
    width: 100%;
    max-width: 135px;
    height: 176px;
    padding: 20px;
    @media (max-width: 550px) {
        max-width: 100px;
        height: 160px;
        padding: 10px;
    }
    @media (max-width: 360px) {
        padding: 5px;
        max-width: 95px;
    }
}
.productMain {
    display: flex;
    align-items: center;
    flex-basis: 63%;
    margin-right: 20px;
    @media (max-width: 750px) {
        flex-basis: 100%;
        max-width: 450px;
        margin-right: 0;
    }
}
.productInfo {
    width: 100%;
    max-width: 230px;
    margin-left: 18px;
    @media (max-width: 360px) {
        margin-left: 12px;
    }
}
.productName {
    font-size: 20px;
    line-height: normal;
    color: #000;
    font-weight: 500;
    text-transform: capitalize;
    @media (max-width: 550px) {
        font-size: 17px;
    }
    @media (max-width: 360px) {
        font-size: 15px;
    }
}
.productInfoList {
    margin-top: 6px;
}
.productInfoListItem {
    font-size: 14px;
    line-height: 1.2;
    color: #7f7f7f;
    margin-top: 5px;
    @media (max-width: 550px) {
        font-size: 12px;
    }
    @media (max-width: 360px) {
        font-size: 11px;
    }
}
.productAmountInfo {
    display: flex;
    align-items: center;
    @media (max-width: 750px) {
        flex-basis: 100%;
        max-width: 370px;
        margin: 20px 0 0 155px;
    }
    @media (max-width: 550px) {
        margin-left: 120px;
    }
}
.productAmount {
}
.productTotalPrice {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.16px;
    margin-left: 40px;
    @media (max-width: 750px) {
        margin-left: 30px;
    }
    @media (max-width: 550px) {
        margin-left: 20px;
        font-size: 14px;
    }
}
</style>
