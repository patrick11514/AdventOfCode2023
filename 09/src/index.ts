import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const getHistory = (historySequence: number[]): number => {
    const layers: number[][] = [historySequence]

    while (!layers[layers.length - 1].every((n) => n === 0)) {
        const current = layers[layers.length - 1]
        const newArr: number[] = []
        for (let i = 0; i < current.length - 1; i++) {
            newArr.push(current[i + 1] - current[i])
        }
        layers.push(newArr)
    }

    layers[layers.length - 1].push(0)

    for (let i = layers.length - 2; i >= 0; i--) {
        const next = layers[i + 1]
        const current = layers[i]

        const last = next[next.length - 1]

        const currentLast = current[current.length - 1]

        current.push(last + currentLast)
    }

    const end = layers[0]

    return end[end.length - 1]
}

const solution = (second: boolean) => {
    return lines
        .map((line) => {
            const historySequence = line.split(' ').map((n) => parseInt(n))
            if (second) {
                historySequence.reverse()
            }

            return getHistory(historySequence)
        })
        .reduce((prev, curr) => prev + curr)
}

console.log(`1.Star: ${solution(false)}`)
console.log(`2.Star: ${solution(true)}`)
