import cloneDeep from 'lodash/fp/cloneDeep.js'
import watchStraps from '@/apollo/query/watchStraps.gql'
import watchStrapsType, { singleWatchStrap } from '@/types/watchStraps'
interface response {
    watchStraps: watchStrapsType
}
export default async function () {
    let result: singleWatchStrap[] | undefined
    const promise: Promise<{
        watchStraps: singleWatchStrap[]
    }> = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery<response>(watchStraps, null, {
            fetchPolicy: 'no-cache'
        })
        onError((error) => {
            console.log(error)
        })
        onResult((res) => {
            const response = cloneDeep(res?.data) || null
            if (response) {
                const result = response.watchStraps.data
                result.forEach((item, idx, arr) => {
                    if (item.attributes.watch_strap.is_available === false) {
                        arr.splice(idx, 1)
                    }
                    item.choosen = false
                    item.dataFetched = false
                    item.attributes.watch_strap.buckle_butterfly_choosen = false
                })
                resolve({ watchStraps: result })
            } else reject(new Error('result failed'))
        })
    })
    await promise
        .then((res) => {
            result = res.watchStraps
        })
        .catch((err) => {
            console.log(err)
        })
    return { watchStraps: result }
}
