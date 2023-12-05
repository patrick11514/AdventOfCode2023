import path from 'node:path'
import { Worker } from 'node:worker_threads'
import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const maps = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location',
] as const

type mapIds = (typeof maps)[number]

export type mappingData = Record<
    mapIds,
    {
        destination: number
        source: number
        size: number
    }[]
>

const makeThread = async (
    ids: {
        start: number
        end: number
    },
    mappings: mappingData,
) => {
    return new Promise<number>((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'worker'), {
            workerData: [ids, mappings],
        })

        worker.on('message', (message) => {
            resolve(message)
        })

        worker.on('exit', (code) => {
            if (code != 0) {
                reject(code)
            }
        })
    })
}

const solution = async (second: boolean) => {
    let seedNumbers: {
        start: number
        end: number
    }[] = []

    let mappings = {} as mappingData

    let action: mapIds | undefined

    //lodad data
    lines.forEach((line) => {
        if (line.startsWith('seeds: ')) {
            const seedData = line
                .substring('seeds: '.length)
                .split(' ')
                .map((s) => parseInt(s))
            if (!second) {
                seedNumbers = seedData.map((start) => {
                    return {
                        start,
                        end: start + 1,
                    }
                })
            } else {
                while (seedData.length > 0) {
                    const seedIdStart = seedData.shift()
                    const seedIdLength = seedData.shift()

                    if (!seedIdStart || !seedIdLength) continue
                    seedNumbers.push({
                        start: seedIdStart,
                        end: seedIdStart + seedIdLength,
                    })
                }
            }
        }

        if (!action) {
            maps.forEach((map) => {
                if (line.startsWith(map)) {
                    action = map
                    return
                }
            })
            return
        }

        if (action && line == '') {
            action = undefined
            return
        }

        const [destination, source, size] = line.split(' ').map((s) => parseInt(s))
        if (!(action in mappings)) {
            mappings[action] = []
        }

        mappings[action].push({
            destination,
            source,
            size,
        })
    })

    //map
    const promises: Promise<number>[] = []

    seedNumbers.forEach((seedData) => {
        promises.push(makeThread(seedData, mappings))
    })

    return (await Promise.all(promises)).reduce((prev, curr) => (prev < curr ? prev : curr))
}

const main = async () => {
    console.log(`1. Star: ${await solution(false)}`)
    console.log(`2. Star: ${await solution(true)}`)
}

main()
