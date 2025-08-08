<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        visible: boolean
        type?: 'fullscreen' | 'small'
        borderColors?: [string, string]
    }>(),
    {
        visible: false,
        type: 'fullscreen',
        borderColors: () => ['#5078DF', '#ffffff']
    }
)
</script>

<template>
    <transition name="fade">
        <div
            v-if="props.visible"
            :class="[
                s.loader,
                {
                    [s.fullscreen]: props.type === 'fullscreen',
                    [s.small]: props.type === 'small'
                }
            ]"
        >
            <div :class="s.loaderCircle">
                <div
                    :class="[s.loaderCircleBorder, s.loaderCircleLine]"
                    :style="{ borderColor: props.borderColors[0] }"
                ></div>
                <div
                    :class="[s.loaderCircleBorder, s.loaderCircleSpin]"
                    :style="{ borderTopColor: props.borderColors[1] }"
                ></div>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" module="s">
.loader {
    &.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(5, 29, 107, 0.6);
        & .loaderCircle {
            width: 50px;
            height: 50px;
        }
    }
    &.small {
        width: 40px;
        height: 40px;
    }
    z-index: 1000;
}
.loaderCircle {
    position: relative;
    width: 100%;
    height: 100%;
    &Border {
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-width: 3px;
        border-style: solid;
        border-radius: 50%;
        border-color: transparent;
    }
    &Spin {
        animation: loader 0.5s linear infinite;
    }
}
@keyframes loader {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
