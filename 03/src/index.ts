import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

let sum = 0
const blacklisted = [114, 58]
const splitChars = ['.', '=', '&', '@', '#', '$']
const mathSymbols = ['+', '-', '*', '/', '*']

lines.forEach((line) => {
    let array = [line]
    for (const char of splitChars) {
        let newArray: string[] = []
        array.forEach((a) => {
            const splited = a.split(char).filter((c) => c != '')
            newArray = newArray.concat(splited)
        })

        array = newArray
    }

    array.forEach((num) => {
        if (mathSymbols.includes(num)) return

        let include = false
        for (const symbol of mathSymbols) {
            if (num.includes(symbol)) {
                if (!num.startsWith(symbol) && !num.endsWith(symbol)) {
                    include = true
                }
            }
        }

        if (include) {
            num = eval(num)
        } else {
            return
        }

        const number = parseInt(num)
        if (!blacklisted.includes(number)) {
            sum += number
        }
    })
})

console.log(sum)
