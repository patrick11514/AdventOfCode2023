import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const process2 = (line: string) => parseInt(line.split(':')[1].trim().replaceAll(' ', ''))

const process = (line: string) =>
    line
        .split(':')[1]
        .trim()
        .split(' ')
        .map((n) => n.trim())
        .filter((n) => n != '')
        .map((n) => parseInt(n))
const solution = (second: boolean) => {
    let times: number[]
    let topDistances: number[]
    if (!second) {
        times = process(lines[0])
        topDistances = process(lines[1])
    } else {
        times = [process2(lines[0])]
        topDistances = [process2(lines[1])]
    }

    return times
        .map((time, index) => {
            let solutions = 0

            for (let i = 0; i <= time; i++) {
                const speed = i
                const distance = (time - i) * speed

                if (distance > topDistances[index]) {
                    solutions++
                }
            }

            return solutions
        })
        .reduce((prev, curr) => prev * curr)
}

console.log(`1.star ${solution(false)}`)
console.log(`2.star ${solution(true)}`)
