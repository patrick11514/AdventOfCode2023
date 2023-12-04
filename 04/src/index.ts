import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const getSolutionLines = () => {
    return lines.map((line) => {
        return line
            .split(':')
            .filter((data) => !data.includes('Card'))
            .map((data) => {
                return data.split('|').map((data) => {
                    return data.trim()
                })
            })
            .flat()
            .map((value) => {
                return value
                    .split(' ')
                    .filter((v) => v != '')
                    .map((v) => {
                        return parseInt(v)
                    })
            })
    })
}

const solution1 = () => {
    return getSolutionLines()
        .map((data) => {
            const [winningNumbers, myNumbers] = data

            let points = 0

            winningNumbers.forEach((number) => {
                if (myNumbers.includes(number)) {
                    points = points === 0 ? 1 : points * 2
                }
            })

            return points
        })
        .reduce((prev, current) => {
            return prev + current
        })
}

const solution2 = () => {
    const pairs = getSolutionLines()

    let indexesToApproach = Array.from({ length: pairs.length }, (_, i) => i)
    let index = 0
    let size = indexesToApproach.length

    while (index < size) {
        const currentCardIndex = indexesToApproach[index]
        const [winningNumbers, myNumbers] = pairs[currentCardIndex]

        let wins = 0

        winningNumbers.forEach((number) => {
            if (myNumbers.includes(number)) {
                wins++
            }
        })

        for (let i = 0; i < wins; i++) {
            const cardIndex = currentCardIndex + i + 1
            if (cardIndex < pairs.length) {
                indexesToApproach.push(cardIndex)
            }
        }

        size = indexesToApproach.length
        index++
    }

    return indexesToApproach.length
}

console.log(`1. star: ${solution1()}`)
console.log(`2. star: ${solution2()}`)
