declare global {
    interface Window {
        ym?: (...args: any[]) => void
    }
}

export default defineNuxtPlugin(() => {
    if (process.client) {
        ;(function (
            m: any,
            e: Document,
            t: string,
            r: string,
            i: string,
            k?: HTMLScriptElement,
            a?: Element
        ) {
            m[i] =
                m[i] ||
                function (...args: unknown[]) {
                    ;(m[i].a = m[i].a || []).push(args)
                }
            m[i].l = Date.now()
            for (let j = 0; j < e.scripts.length; j++) {
                if (e.scripts[j].src === r) return
            }
            k = e.createElement(t) as HTMLScriptElement
            a = e.getElementsByTagName(t)[0]
            k.async = true
            k.src = r
            a?.parentNode?.insertBefore(k, a)
        })(
            window,
            document,
            'script',
            'https://mc.yandex.ru/metrika/tag.js?id=103476650',
            'ym'
        )

        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
            window.ym(103476650, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: 'dataLayer',
                accurateTrackBounce: true,
                trackLinks: true
            })
        }
    }
})

