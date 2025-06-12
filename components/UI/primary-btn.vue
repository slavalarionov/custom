<script setup lang="ts">
const props = defineProps<{
    to?: string
    href?: string
    disabled?: boolean
    active?: boolean
}>()
</script>

<template>
    <router-link
        v-if="props.to"
        :class="[
            'primary--btn',
            {
                disabled: props.disabled && props.disabled !== undefined,
                active: props.active && props.active !== undefined
            }
        ]"
        :to="props.to"
    >
        <slot />
    </router-link>
    <a
        v-else-if="props.href"
        href="props.href"
        :class="[
            'primary--btn',
            {
                disabled: props.disabled && props.disabled !== undefined,
                active: props.active && props.active !== undefined
            }
        ]"
    >
        <slot />
    </a>
    <button
        v-else
        :class="[
            'primary--btn',
            {
                disabled: props.disabled && props.disabled !== undefined,
                active: props.active && props.active !== undefined
            }
        ]"
    >
        <slot />
    </button>
</template>

<style lang="scss">
.primary--btn {
    width: 100%;
    display: block;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
    color: $base-color;
    padding: 20px;
    background: #f5f5f5;
    border: 1px solid transparent;
    border-radius: 14px;
    transition: $base-transition;
    &.disabled {
        pointer-events: none;
        background: transparent;
        color: #a9a9a9;
        border-color: #d9d9d9;
    }
    &.active {
        background: $secondary-color;
        color: #fff;
    }
}
</style>
