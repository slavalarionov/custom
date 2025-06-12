<script setup lang="ts">
import checkmarkIcon from '@/components/icons/checkmark-icon.vue'
const props = defineProps<{
    id?: string
    value?: string
    name?: string
    modelValue?: boolean
}>()
const onChange = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <label :class="[s.checkbox, { [s.checked]: props.modelValue }]">
        <input
            v-show="false"
            :id="props.id"
            type="checkbox"
            :class="s.checkboxInput"
            :value="props.value"
            :name="props.name"
            :checked="props.modelValue"
            @change="onChange"
        />
        <button type="button" :class="s.checkboxBtn">
            <checkmark-icon :class="s.checkboxBtnIcon" />
        </button>
        <slot />
    </label>
</template>

<style lang="scss" module="s">
.checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    &.checked {
        & .checkboxBtnIcon {
            opacity: 1;
        }
    }
    &Btn {
        position: relative;
        width: 17px;
        height: 17px;
        border: 1px solid #7a7a7a;
        border-radius: 2px;
        &Icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            opacity: 0;
        }
    }
}
</style>
