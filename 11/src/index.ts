import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const solution = (second: boolean) => {
    type GalaxyInfo = {
        x: number
        y: number
    }
    const galaxies: GalaxyInfo[] = []

    let row = 0
    let realRow = 0
    for (const line of lines) {
        let increment = 1
        if (!line.includes('#')) {
            increment = second ? 1000000 : 2
        }

        const chars = line.split('')
        let column = 0
        let realColumn = 0
        for (const char of chars) {
            let lIncrement = 1

            if (char == '#') {
                galaxies.push({
                    x: column,
                    y: row,
                })
            } else {
                //check full column
                let ok = true
                lines.forEach((line) => {
                    if (line[realColumn] == '#') ok = false
                })

                if (ok) {
                    lIncrement = second ? 1000000 : 2
                }
            }

            column += lIncrement
            realColumn++
        }

        row += increment
        realRow++
    }

    const calculated: Record<number, number[]> = {}
    galaxies.forEach((_, i) => {
        calculated[i] = []
    })

    let sum = 0

    galaxies.forEach((galaxyData, i) => {
        galaxies.forEach((anotherGalaxyData, i2) => {
            if (i == i2) return
            if (calculated[i].includes(i2) || calculated[i2].includes(i)) return

            let distance = 0

            let xStart: number
            let xEnd: number
            if (galaxyData.x > anotherGalaxyData.x) {
                xStart = anotherGalaxyData.x
                xEnd = galaxyData.x
            } else {
                xEnd = anotherGalaxyData.x
                xStart = galaxyData.x
            }

            distance += xEnd - xStart

            let yStart: number
            let yEnd: number
            if (galaxyData.y > anotherGalaxyData.y) {
                yStart = anotherGalaxyData.y
                yEnd = galaxyData.y
            } else {
                yEnd = anotherGalaxyData.y
                yStart = galaxyData.y
            }

            distance += yEnd - yStart

            sum += distance

            calculated[i].push(i2)
        })
    })

    return sum
}

console.log(`1.star: ${solution(false)}`)
console.log(`2.star: ${solution(true)}`)
