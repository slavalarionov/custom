import cloneDeep from 'lodash/fp/cloneDeep.js'
import deliveryInfoQuery from '@/apollo/query/deliveryInfo.gql'
import deliveryMailDataType from '@/types/deliveryInfo'
interface response {
    delivery: deliveryMailDataType
}
let result: {
    deliveryInfo: deliveryMailDataType
} | null = null
export default async function () {
    const promise: Promise<{
        deliveryInfo: deliveryMailDataType
    }> = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery<response>(deliveryInfoQuery)
        onError((error) => {
            console.log(error)
        })
        onResult((e) => {
            const result = cloneDeep(e.data)
            if (result) {
                const deliveryInfo = result.delivery
                resolve({ deliveryInfo })
            } else {
                reject(new Error('some-error'))
            }
        })
    })
    await promise.then((data) => {
        result = data
    })
    return result
}
