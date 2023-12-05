import { isMainThread, parentPort, workerData } from 'worker_threads'
import { mappingData } from '.'

if (!isMainThread) {
    const [seedData, mappings] = workerData as [
        {
            start: number
            end: number
        },
        mappingData,
    ]

    let lowest: undefined | number

    for (let i = seedData.start; i < seedData.end; i++) {
        let seedNumber = i
        Object.values(mappings).forEach((mappingsList) => {
            for (const mapping of mappingsList) {
                if (seedNumber >= mapping.source && seedNumber <= mapping.source + mapping.size - 1) {
                    const target = seedNumber - mapping.source + mapping.destination
                    seedNumber = target
                    break
                }
            }
        })

        if (!lowest || seedNumber < lowest) lowest = seedNumber
    }

    parentPort?.postMessage(lowest)
}
