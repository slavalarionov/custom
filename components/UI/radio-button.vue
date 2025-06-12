<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
    id?: string
    value?: string
    name?: string
    modelValue?: string | any
}>()
const isChecked = computed(() => {
    return props.value === props.modelValue
})
const onChange = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
    emit('valueChange', (e.target as HTMLInputElement).value)
}
const emit = defineEmits(['update:modelValue', 'valueChange'])
</script>

<template>
    <label :class="s.radio">
        <input
            v-show="false"
            :id="props.id"
            type="radio"
            :class="s.radioInput"
            :value="props.value"
            :name="props.name"
            :checked="isChecked"
            @change="onChange"
        />
        <button type="button" :class="s.radioBtn"></button>
        <slot />
    </label>
</template>

<style lang="scss" module="s">
.radio {
    display: flex;
    align-items: center;
    cursor: pointer;
    .radioInput:checked + &Btn {
        &::before {
            opacity: 1;
        }
    }
    &Btn {
        position: relative;
        width: 20px;
        height: 20px;
        border: 1px solid #000;
        border-radius: 50%;
        margin-right: 8px;
        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            background: #000;
            border-radius: 50%;
            opacity: 0;
            transition: 0.3s ease;
        }
    }
}
</style>
