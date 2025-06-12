<script setup lang="ts">
const props = defineProps<{
    title?: string
    modelValue?: string
    placeholder?: string
    mask?: string
    maskTokens?: string
    readonly?: boolean
    isValid?: boolean
    errorMessage?: string
}>()
const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
</script>

<template>
    <label :class="s.label">
        <p v-if="props.title" :class="s.inputTitle">{{ props.title }}</p>
        <input
            v-if="props.mask"
            v-maska
            :data-maska="props.mask"
            :data-maska-tokens="maskTokens"
            type="text"
            :class="s.input"
            :placeholder="props.placeholder"
            :value="props.modelValue"
            :readonly="props.readonly"
            @input="
                emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value
                )
            "
            @focus="emit('focus')"
            @blur="emit('blur')"
        />
        <input
            v-else
            type="text"
            :class="s.input"
            :placeholder="props.placeholder"
            :value="props.modelValue"
            :readonly="props.readonly"
            @input="
                emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value
                )
            "
            @focus="emit('focus')"
            @blur="emit('blur')"
        />
        <p
            v-if="props.errorMessage && props.isValid === false"
            :class="s.errorMessage"
        >
            {{ props.errorMessage }}
        </p>
    </label>
</template>

<style lang="scss" module="s">
.label {
    display: block;
    width: 100%;
}
.inputTitle {
    font-size: 17px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    letter-spacing: -0.17px;
    margin-bottom: 13px;
    @media (max-width: 550px) {
        font-size: 15px;
    }
    @media (max-width: 360px) {
        font-size: 13px;
        margin-bottom: 8px;
    }
}
.input {
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    color: #7f7f7f;
    line-height: normal;
    letter-spacing: -0.16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    @media (max-width: 550px) {
        font-size: 14px;
    }
    @media (max-width: 360px) {
        font-size: 12px;
    }
}
.errorMessage {
    display: block;
    font-size: 16px;
    line-height: normal;
    color: rgb(255, 47, 47);
    margin-top: 10px;
}
</style>
