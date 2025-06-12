<script setup lang="ts">
import previewItem from '@/components/common/preview-item/index.vue'
const props = defineProps<{
    viewFixed: boolean
}>()
</script>

<template>
    <div :class="[s.preview, { [s.viewFixed]: props.viewFixed }]">
        <div :class="s.previewInner">
            <preview-item :class="[s.previewItem, s.previewItem1]" :view="1" />
            <preview-item :class="[s.previewItem, s.previewItem2]" :view="2" />
            <preview-item :class="[s.previewItem, s.previewItem3]" :view="3" />
        </div>
    </div>
</template>

<style lang="scss" module="s">
.preview {
    position: relative;
}
.previewInner {
    position: sticky;
    top: 20px;
    width: 100%;
    color: #333;
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: 375px 375px;
    grid-gap: 16px;
    background: #fff;
}
.previewItem1 {
    grid-row: 1/3;
    grid-column: 1;
}
.previewItem2 {
    grid-column: 2;
    grid-row: 2;
}
.previewItem3 {
    grid-column: 2;
    grid-row: 1;
}
@media (max-width: 850px) {
    .previewInner {
        grid-template-rows: 42vw 42vw;
    }
}
@media (max-width: 550px) {
    .preview {
        &.viewFixed {
            height: 88vw;
            & .previewInner {
                position: fixed;
                left: 0;
                right: 0;
                top: 20px;
                padding: 0 20px;
                z-index: 1000;
            }
        }
    }
}
</style>
