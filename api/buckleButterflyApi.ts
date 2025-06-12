import cloneDeep from 'lodash/fp/cloneDeep.js'
import buckleButterflyQuery from '@/apollo/query/buckleButterfly.gql'
import buckleButterflyType from '@/types/buckleButterfly'
interface response {
    buckleButterfly: buckleButterflyType
}
export default async function () {
    let result: {
        buckleButterfly: buckleButterflyType | undefined
    }
    const promise: Promise<{
        buckleButterfly: buckleButterflyType
    }> = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery<response>(buckleButterflyQuery)
        onError((error) => {
            console.log(error)
        })
        onResult((e) => {
            const result = cloneDeep(e.data)
            if (result) {
                const buckleButterfly = result.buckleButterfly
                buckleButterfly.choosen = false
                resolve({ buckleButterfly })
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
