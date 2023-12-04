import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

let sum = 0
const blacklisted = [114, 58]
const splitChars = ['.', '=', '&', '@', '#', '$']

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
        if (isNaN(parseInt(num))) return

        const number = parseInt(num)
        if (!blacklisted.includes(number)) {
            sum += number
        }
    })
})

console.log(sum)
