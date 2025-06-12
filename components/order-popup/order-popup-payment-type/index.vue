<script setup lang="ts">
import sharesTinkoffImage from '@/assets/img/shares.jpg'
type paymentListType = {
    type: string
    image?: string
}[]
const props = defineProps<{
    modelValue: string
    defaultValue: string
}>()
const paymentTypeList: Ref<paymentListType> = ref([
    {
        type: 'Банковской картой'
    },
    {
        type: 'Долями от Тинькофф',
        image: sharesTinkoffImage
    }
])
const selectedTypeOfPayment = ref(props.defaultValue || props.modelValue)
const onChange = (value: string) => {
    emit('update:modelValue', value)
}
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div :class="s.paymentType">
        <p :class="s.paymentTypeTitle">Способ оплаты:</p>
        <ul :class="s.paymentTypeList">
            <li
                v-for="(item, idx) in paymentTypeList"
                :key="idx"
                :class="[s.paymentTypeListItem]"
            >
                <radio-button
                    v-model="selectedTypeOfPayment"
                    name="payment-type"
                    :value="item.type"
                    @value-change="onChange"
                >
                    <p :class="s.paymentTypeListItemType">
                        {{ item.type }}
                    </p>
                    <img
                        v-if="item.image"
                        :src="item.image"
                        alt=""
                        :class="s.paymentTypeListItemImage"
                    />
                </radio-button>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" module="s">
.paymentType {
    margin-top: 40px;
}
.paymentTypeTitle {
    font-size: 17px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.17px;
    color: #000;
    @media (max-width: 550px) {
        font-size: 14px;
    }
}
.paymentTypeList {
    margin-top: 20px;
}
.paymentTypeListItem {
    margin-bottom: 12px;
    &:last-child {
        margin-bottom: 0;
    }
}
.paymentTypeListItemType {
}
.paymentTypeListItemImage {
    max-width: 62px;
    margin-left: 12px;
}
</style>
