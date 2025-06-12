<script setup lang="ts">
import type watchStrapsType from '@/types/watchStraps'
const props = defineProps<{
    watchStraps: watchStrapsType | null
}>()
</script>

<template>
    <transition name="fade-right">
        <div v-if="props.watchStraps?.data" :class="s.step">
            <div :class="s.stepWrapper">
                <strap-model-item
                    v-for="(item, idx) in props.watchStraps.data"
                    :key="idx"
                    :watch-strap="item"
                />
            </div>
        </div>
    </transition>
</template>

<style lang="scss" module="s">
.step {
    width: 100%;
    margin-top: 20px;
    &Wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        justify-content: space-between;
        grid-gap: 40px;
    }
}
@media (max-width: 1450px) {
    .step {
        &Wrapper {
            grid-gap: 25px;
        }
    }
}
@media (max-width: 1350px) {
    .step {
        &Wrapper {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            grid-gap: 30px;
        }
    }
}
@media (max-width: 1100px) {
    .stepWrapper {
        max-width: 800px;
        margin: 0 auto;
    }
}
@media (max-width: 850px) {
    .step {
        &Wrapper {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
    }
}
@media (max-width: 650px) {
    .step {
        margin-top: 45px;
        &Wrapper {
            grid-template-columns: 1fr 1fr;
        }
    }
}
@media (max-width: 500px) {
    .step {
        &Wrapper {
            grid-gap: 40px 20px;
        }
    }
}
</style>
