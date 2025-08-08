<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>()
defineEmits(['update:modelValue'])
</script>

<template>
    <div
        :class="['switcher', { checked: props.modelValue === true }]"
        @click.stop="$emit('update:modelValue', !props.modelValue)"
    >
        <input type="checkbox" class="switcher__checkbox" />
        <button class="switcher__btn"></button>
    </div>
</template>

<style lang="scss">
.switcher {
    display: flex;
    align-items: center;
    cursor: pointer;
    &.checked {
        & .switcher__btn::before {
            transform: translate(100%, -50%);
            background: #5078DF;
        }
    }
}
.switcher__checkbox {
    display: none;
}
.switcher__btn {
    position: relative;
    min-width: 70px;
    min-height: 40px;
    border-radius: 56px;
    border: 1px solid #a9a9a9;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.1) inset;
    background: #fff;
    pointer-events: none;
    &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translate(0, -50%);
        width: calc(50% - 5px);
        height: calc(100% - 10px);
        background: #d9d9d9;
        border-radius: 50%;
        transition: 0.3s ease;
    }
}
</style>
