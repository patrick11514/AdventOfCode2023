import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const solution = (second: boolean) => {
    const numbers: {
        line: number
        start: number
        end: number
        value: number
    }[] = []

    const gearPositions: {
        line: number
        pos: number
    }[] = []

    //horizontally
    lines.forEach((line, lineId) => {
        for (let i = 0; i < line.length; i++) {
            const part = line.substring(i)
            const number = parseInt(part)

            if (line[i] == '*') {
                gearPositions.push({
                    line: lineId,
                    pos: i,
                })
            }

            if (!isNaN(number) && !isNaN(parseInt(part[0]))) {
                //check symbols
                const numberStart = i
                const numberEnd = numberStart + number.toString().length

                const positions: {
                    line: number
                    pos: number
                }[] = []

                //on top
                for (let l = numberStart - 1; l <= numberEnd; l++) {
                    positions.push({
                        line: lineId - 1,
                        pos: l,
                    })
                }

                //left
                positions.push({
                    line: lineId,
                    pos: numberStart - 1,
                })

                positions.push({
                    line: lineId,
                    pos: numberEnd,
                })

                //under
                for (let l = numberStart - 1; l <= numberEnd; l++) {
                    positions.push({
                        line: lineId + 1,
                        pos: l,
                    })
                }

                for (const position of positions) {
                    const line = lines[position.line]
                    //console.log(line)
                    if (!line) continue
                    const char = line[position.pos]
                    if (!char) continue
                    const num = parseInt(char)

                    if (char != '.' && isNaN(num)) {
                        numbers.push({
                            line: lineId,
                            start: numberStart,
                            end: numberEnd - 1,
                            value: number,
                        })
                        break
                    }
                }

                //console.log(numbers[numbers.length - 1])

                i += number.toString().length - 1
            }
        }
    })
    if (!second) {
        return numbers.map((v) => v.value).reduce((prev, curr) => prev + curr)
    } else {
        let summ = 0

        gearPositions.forEach((gearData) => {
            const numbersAround: typeof numbers = []

            numbers.forEach((numberData) => {
                let found = false
                for (let x = gearData.pos - 1; x <= gearData.pos + 1; x++) {
                    for (let y = gearData.line - 1; y <= gearData.line + 1; y++) {
                        if (numberData.line != y) {
                            continue
                        }

                        if (numberData.start <= x && numberData.end >= x) {
                            numbersAround.push(numberData)
                            found = true
                            break
                        }
                    }

                    if (found) break
                }
            })

            if (numbersAround.length == 2) {
                summ += numbersAround.map((n) => n.value).reduce((prev, curr) => prev * curr)
            }
        })

        return summ
    }
}

//4361
console.log(`1. star: ${solution(false)}`)
console.log(`2. star: ${solution(true)}`)
