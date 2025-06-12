<script setup lang="ts">
type navItemsType = {
    text: string
    href: string
    type: string
}[]
const props = defineProps<{ navItems: navItemsType }>()
</script>

<template>
    <nav :class="s.nav">
        <ul :class="s.navList">
            <li
                v-for="(item, idx) in props.navItems"
                :key="idx"
                :class="s.navListItem"
            >
                <a v-if="item.type === 'anchor'" :href="item.href">{{
                    item.text
                }}</a>
                <nuxt-link v-else :to="item.href">{{ item.text }}</nuxt-link>
            </li>
        </ul>
    </nav>
</template>
<style lang="scss" module="s">
.nav {
    &List {
        display: flex;
        align-items: center;
        &Item {
            font-size: 14px;
            font-weight: 400;
            margin-right: 30px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
@media (max-width: 1100px) {
    .navListItem {
        margin-right: 20px;
    }
}
</style>
