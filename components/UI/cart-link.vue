<script setup lang="ts">
const props = withDefaults(defineProps<{ path?: string }>(), { path: '/' })
</script>

<template>
    <router-link class="cart-link" :to="props.path">
        <span class="cart-link__goods-amount">0</span>
        <CartIcon class="cart-link__icon" />
    </router-link>
</template>
<style lang="scss">
.cart-link {
    position: relative;
    width: 100%;
    max-width: 28px;
    max-height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 5px 8px;
    overflow: hidden;
    &__icon {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    &__goods-amount {
        display: block;
        font-size: 15px;
        line-height: 1;
    }
}
</style>
