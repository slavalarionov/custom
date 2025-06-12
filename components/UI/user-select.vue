<script setup lang="ts">
const props = defineProps<{
    options:
        | {
              value: string
              text: string
          }[]
        | null
        | undefined
    modelValue?: string
    value?: string
    label?: string
    hideValue?: boolean
}>()
const value = ref(props.value)
watchEffect(() => {
    value.value = props.value
})
defineEmits(['update:modelValue', 'change:modelValue'])
</script>

<template>
    <div :class="s.userSelectWrapper">
        <select
            v-if="value !== (null || undefined)"
            :class="[s.userSelect, { [s.hideValue]: props.hideValue }]"
            :value="value"
        >
            <option
                v-if="props.label"
                value=""
                :class="s.userSelectLabel"
                selected
                disabled
            >
                {{ props.label }}
            </option>
            <option
                v-for="(option, idx) in props.options"
                :key="idx"
                :value="option.value"
            >
                {{ option.text }}
            </option>
        </select>
        <mark-down-icon :class="s.userSelectIcon" />
    </div>
</template>

<style lang="scss" module="s">
.userSelectWrapper {
    position: relative;
    cursor: pointer;
}
.userSelect {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    background: #f5f5f5;
    padding: 12px 40px 12px 20px;
    color: inherit;
    line-height: normal;
    border: none;
    outline: transparent;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    &.hideValue {
        width: 100%;
        color: transparent;
        user-select: none;
        & option {
            color: #333;
        }
    }
    &Icon {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
    }
    @media (max-width: 750px) {
        font-size: 14px;
    }
}
</style>
