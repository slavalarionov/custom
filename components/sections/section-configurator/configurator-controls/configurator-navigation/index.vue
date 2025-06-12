<script setup lang="ts">
const configuratorStore = useConfiguratorStore()
configuratorStore.getWatchData()
const currentStepNum = computed(() => {
    return configuratorStore.currentStepNum
})
const stepsAmount = computed(() => {
    return configuratorStore.stepsAmount
})
const prevStepQuery = computed(() => {
    return configuratorStore.prevStepQuery
})
const nextStepQuery = computed(() => {
    return configuratorStore.nextStepQuery
})
const nextStepReady = computed(() => {
    return configuratorStore.nextStepReady
})
</script>

<template>
    <div :class="s.navigation">
        <primary-btn
            :class="[
                s.navigationBtn,
                s.homeBtn,
                { [s.currentStepFirst]: currentStepNum === 1 }
            ]"
            to="/"
        >
            <span :class="s.navigationBtnLongText">На главную</span>
            <span :class="s.navigationBtnShortText">Главная</span>
        </primary-btn>
        <primary-btn
            v-if="currentStepNum > 1"
            type="button"
            :class="s.navigationBtn"
            @click="$router.push({ query: { step: prevStepQuery } })"
        >
            Назад
        </primary-btn>
        <primary-btn
            v-if="nextStepQuery"
            type="button"
            :class="s.navigationBtn"
            :disabled="!nextStepReady"
            :active="nextStepReady"
            @click="$router.push({ query: { step: nextStepQuery } })"
        >
            Далее
        </primary-btn>
        <primary-btn
            v-if="currentStepNum === stepsAmount"
            type="button"
            :class="[s.navigationBtn, s.navigationBtn]"
            :active="currentStepNum === stepsAmount"
            @click="configuratorStore.showOrderPopup"
        >
            Оплатить
        </primary-btn>
    </div>
</template>

<style lang="scss" module="s">
.navigation {
    display: flex;
    align-items: center;
    margin-left: auto;
    &Btn {
        width: fit-content;
        margin-right: 13px;
        padding: 12px 20px;
        &:last-child {
            margin-right: 0;
        }
    }
}
.homeBtn {
    display: none;
    &.currentStepFirst {
        display: block;
    }
}
.navigationBtnLongText {
    display: block;
}
.navigationBtnShortText {
    display: none;
}
@media (max-width: 750px) {
    .navigation {
        position: absolute;
        top: 20px;
        right: 20px;
    }
}
@media (max-width: 550px) {
    .homeBtn {
        display: block;
    }
}
@media (max-width: 400px) {
    .navigationBtnLongText {
        display: none;
    }
    .navigationBtnShortText {
        display: block;
    }
}
</style>
