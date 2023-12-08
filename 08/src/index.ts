import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const instStr = lines.shift()
if (!instStr) throw 'IDK'
const instructions = instStr.split('') as ('L' | 'R')[]
lines.shift() //remove empty line

const solution = () => {
    const start = 'AAA'
    const end = 'ZZZ'

    const elements: Record<string, string[]> = {}

    lines.forEach((line) => {
        const [left, array] = line.split(' = ')
        elements[left] = array.split(',').map((e) => e.trim().replaceAll('(', '').replaceAll(')', ''))
    })

    let current = start
    let steps = 0
    let currentInstruction = 0

    while (current != end) {
        const instruction = instructions[currentInstruction]

        const data = elements[current]

        current = data[instruction === 'L' ? 0 : 1]

        currentInstruction++
        steps++

        if (currentInstruction == instructions.length) {
            currentInstruction = 0
        }
    }

    return steps
}

const solution2 = () => {
    //https://www.30secondsofcode.org/js/s/lcm/
    const lcm = (...arr: number[]) => {
        const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y))
        const _lcm = (x: number, y: number) => (x * y) / gcd(x, y)
        return [...arr].reduce((a, b) => _lcm(a, b))
    }

    const elements: Record<string, string[]> = {}

    lines.forEach((line) => {
        const [left, array] = line.split(' = ')
        elements[left] = array.split(',').map((e) => e.trim().replaceAll('(', '').replaceAll(')', ''))
    })

    let currents: string[] = Object.keys(elements).filter((e) => e.endsWith('A'))

    let currentInstruction = 0

    const stepsForEachCurrent: number[] = []

    currents.forEach((current) => {
        let steps = 0

        while (!current.endsWith('Z')) {
            const instruction = instructions[currentInstruction]
            const data = elements[current]

            current = data[instruction === 'L' ? 0 : 1]

            currentInstruction++
            steps++

            if (currentInstruction == instructions.length) {
                currentInstruction = 0
            }
        }

        stepsForEachCurrent.push(steps)
    })

    return lcm(...stepsForEachCurrent)
}

console.log(`1. star: ${solution()}`)
console.log(`2. star: ${solution2()}`)
