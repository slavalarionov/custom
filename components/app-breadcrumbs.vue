<script setup lang="ts">
type listType = {
    value: string
    path: string
}[]
const props = defineProps<{ list: listType }>()
</script>

<template>
    <div class="breadcrumbs">
        <div class="container breadcrumbs__container">
            <ul class="breadcrumbs__list">
                <li
                    v-for="(item, idx) in props.list"
                    :key="idx"
                    class="breadcrumbs__list_item"
                >
                    <router-link :to="item.path">
                        {{ item.value }}
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss">
.breadcrumbs {
    margin-top: 40px;
}
.breadcrumbs__container {
}
.breadcrumbs__list {
    display: flex;
    align-items: center;
}
.breadcrumbs__list_item {
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    &::after {
        content: '-';
        color: inherit;
        display: inline-block;
        margin: 0 7px;
    }
    &:last-child::after {
        display: none;
    }
    & a {
        transition: 0.2s ease;
        color: #7a7a7a;
        &:hover,
        &.router-link-active {
            color: #454545;
            text-decoration: underline;
        }
    }
}
</style>
