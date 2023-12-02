import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const bag = {
    red: 12,
    green: 13,
    blue: 14,
}

const solution = (second: boolean) => {
    let result = 0

    lines.forEach((line) => {
        let [game, turns] = line.split(':')
        const [_, id] = game.split(' ')
        console.log('GameId: ' + id)

        const max = {
            red: 0,
            green: 0,
            blue: 0,
        }

        turns.split(';').forEach((turn) => {
            turn.split(',')
                .map((color) => color.trim())
                .forEach((color) => {
                    const [strNum, name] = color.split(' ') as [string, keyof typeof max]
                    const number = parseInt(strNum)
                    console.log(number, name)

                    if (number > max[name]) {
                        max[name] = number
                    }
                })
        })

        if (second) {
            result += max.red * max.green * max.blue
        } else {
            if (max.red > bag.red || max.green > bag.green || max.blue > bag.blue) {
                return
            }

            result += parseInt(id)
        }
    })
    return result
}

console.log('Star 1: ' + solution(false))
console.log('Star 2: ' + solution(true))
