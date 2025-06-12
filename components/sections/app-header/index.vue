<script setup lang="ts">
const generalNavItems = [
    {
        text: 'Вернуться на сайт',
        href: 'https://slavalarionov.com/',
        type: 'link'
    }
]
const otherNavItems = [
    {
        text: 'О нас',
        href: '/',
        type: 'link'
    },
    {
        text: 'FAQ',
        href: '/',
        type: 'link'
    },
    {
        text: 'Контакты',
        href: '/',
        type: 'link'
    }
]
</script>

<template>
    <header :class="s.header">
        <div :class="['container', s.headerContainer]">
            <app-logo :class="s.headerLogo" />
            <div :class="s.headerNavInner">
                <app-nav
                    :class="[s.headerNav, s.headerNavGeneral]"
                    :nav-items="generalNavItems"
                />
                <app-nav
                    :class="[s.headerNav, s.headerNavOther]"
                    :nav-items="otherNavItems"
                />
            </div>
        </div>
    </header>
</template>
<style lang="scss" module="s">
.header {
    background: $secondary-color;
    color: #fff;
    padding: 16px 0;
}
.headerContainer {
    display: flex;
    align-items: center;
}
.headerLogo {
    margin-right: 110px;
}
.headerNavInner {
    display: flex;
    align-items: flex-start;
    margin: 0 auto;
    flex-grow: 1;
}
.headerNav {
    margin-right: 40px;
    &:last-child {
        margin-right: 0;
    }
}
.headerNavOther {
    margin-left: auto;
}
@media (max-width: 1100px) {
    .headerLogo {
        margin-right: 55px;
    }
}
@media (max-width: 1000px) {
    .headerNavInner {
        display: none;
    }
}
</style>
