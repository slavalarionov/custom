<script setup lang="ts">
import mergeImages from 'merge-images'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { computed } from 'vue'
import { useConfiguratorStore } from '@/store/configuratorStore'
import previewItem from '@/components/common/preview-item/index.vue'
const configuratorStore = useConfiguratorStore()
const finalImages = computed(() => {
    return configuratorStore.finalImages
})
const downloadBtn = ref<HTMLLinkElement>()
const view1Images = computed(() => {
    return configuratorStore.view1Images
})
const view2Images = computed(() => {
    return configuratorStore.view2Images
})
const view3Images = computed(() => {
    return configuratorStore.view3Images
})
const loadRender = () => {
    configuratorStore.isLoading = true
    Promise.allSettled([
        mergeImages(view1Images.value, {
            crossOrigin: 'Anonymous'
        }).then((b64) => {
            configuratorStore.setFinalImage(1, b64)
        }),
        mergeImages(view2Images.value, {
            crossOrigin: 'Anonymous'
        }).then((b64) => {
            configuratorStore.setFinalImage(2, b64)
        }),
        mergeImages(view3Images.value, {
            crossOrigin: 'Anonymous'
        }).then((b64) => {
            configuratorStore.setFinalImage(3, b64)
        })
    ])
        .catch((err) => {
            configuratorStore.isLoading = false
            console.log(err)
        })
        .finally(() => {
            if (
                finalImages.value.view1 &&
                finalImages.value.view2 &&
                finalImages.value.view3
            ) {
                function dataURLtoBase64(dataURL) {
                    const base64String = dataURL.split(',')[1]
                    return base64String
                }
                const zip = new JSZip()
                const imagesFolder = zip.folder('render')
                imagesFolder?.file(
                    'вид-1.png',
                    dataURLtoBase64(finalImages.value.view1),
                    {
                        base64: true
                    }
                )
                imagesFolder?.file(
                    'вид-2.png',
                    dataURLtoBase64(finalImages.value.view2),
                    {
                        base64: true
                    }
                )
                imagesFolder?.file(
                    'вид-3.png',
                    dataURLtoBase64(finalImages.value.view3),
                    {
                        base64: true
                    }
                )
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                    saveAs(content, 'render.zip')
                    configuratorStore.isLoading = false
                })
            }
        })
}
</script>

<template>
    <div :class="s.main">
        <div :class="s.mainData">
            <h3 :class="s.mainTitle">
                {{ configuratorStore.additionalOption?.data.attributes.title }}
            </h3>
            <p :class="s.mainDescription">
                {{
                    configuratorStore.additionalOption?.data.attributes
                        .description
                }}
            </p>
            <div
                ref="downloadBtn"
                :class="s.mainLoadRender"
                @click="loadRender"
            >
                <button :class="s.mainLoadRenderBtn">+</button>
                <p :class="s.mainLoadRenderText">
                    Скачайте рендер вашего будущего ремешка
                </p>
            </div>
        </div>
        <div :class="s.mainDesign">
            <preview-item
                :class="[s.mainDesignItem, s.mainDesignItem1]"
                :view="1"
            />
            <preview-item
                :class="[s.mainDesignItem, s.mainDesignItem3]"
                :view="3"
            />
            <preview-item
                :class="[s.mainDesignItem, s.mainDesignItem2]"
                :view="2"
            />
        </div>
    </div>
</template>

<style lang="scss" module="s">
.main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 1200px) {
        flex-direction: column-reverse;
        max-width: 700px;
        margin: 0 auto;
    }
}
.mainData {
    width: 40%;
    max-width: 600px;
    @media (max-width: 1200px) {
        width: 100%;
        margin: 56px 0 0;
        max-width: none;
    }
    @media (max-width: 750px) {
        margin-top: 48px;
    }
}
.mainTitle {
    font-size: 36px;
    font-weight: 300;
    line-height: 50px;
    color: #333;
    @media (max-width: 1200px) {
        font-size: 32px;
    }
    @media (max-width: 750px) {
        font-size: 28px;
    }
    @media (max-width: 400px) {
        font-size: 24px;
    }
}
.mainDescription {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: #333;
    margin-top: 18px;
}
.mainLoadRender {
    width: 100%;
    max-width: 330px;
    display: flex;
    align-items: center;
    margin-top: 48px;
    cursor: pointer;
    &:hover {
        & .mainLoadRenderBtn {
            border-color: $secondary-color;
            color: $secondary-color;
        }
    }
    @media (max-width: 1200px) {
        margin: 18px 0 0;
    }
}
.mainLoadRenderBtn {
    width: 100%;
    max-width: 66px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #949494;
    text-align: center;
    font-size: 34px;
    font-weight: 300;
    line-height: 1;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid #d0d0d0;
    transition: 0.2s ease;
    @media (max-width: 1200px) {
        height: 66px;
    }
}
.mainLoadRenderText {
    width: 100%;
    max-width: 225px;
    font-size: 20px;
    font-style: normal;
    line-height: normal;
    color: #333;
    margin-left: 30px;
    @media (max-width: 750px) {
        font-size: 18px;
        margin-left: 15px;
    }
    @media (max-width: 400px) {
        font-size: 16px;
    }
}
.mainDesign {
    width: 60%;
    max-width: 680px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin-left: 40px;
    @media (max-width: 1200px) {
        width: 100%;
        max-width: none;
        margin: 0;
    }
}
.mainDesignItem {
    width: 200px;
    height: 25vw;
    max-height: 282px;
    margin-right: 40px;
    border-radius: 20px;
    &:last-child {
        margin-right: 0;
    }
    @media (max-width: 1200px) {
        width: 32%;
        height: 40vw;
        margin-right: 20px;
    }
}
.mainDesignItem1 {
}
.mainDesignItem {
}
.mainDesignItem3 {
    padding: 30px;
    @media (max-width: 750px) {
        padding: 16px;
    }
}
.mainDesignItem {
}
.mainDesignItem3 {
}
</style>
