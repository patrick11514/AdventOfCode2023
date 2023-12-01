import { getLines, is_numeric } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const solution = (replace: boolean) => {
    const numbers: number[] = []

    lines.forEach((line) => {
        if (replace) {
            /////SECOND STAR
            //translate characters
            const dict = {
                one: '1',
                two: '2',
                three: '3',
                four: '4',
                five: '5',
                six: '6',
                seven: '7',
                eight: '8',
                nine: '9',
            }

            for (const [str, replace] of Object.entries(dict)) {
                //if overlap (eightwo) it shoud be 82 not just 8wo
                line = line.replaceAll(str, `${str}${replace}${str}`)
            }
            ////SECOND STAR
        }

        const chars = line.split('')

        let start: string | undefined
        let end: string | undefined

        chars.forEach((char) => {
            if (is_numeric(char)) {
                if (!start) {
                    start = char
                }

                end = char
            }
        })

        if (!start || !end) return

        numbers.push(parseInt(`${start}${end}`))
    })

    return numbers.reduce((prev, current) => {
        return prev + current
    })
}

//test 142
console.log(`1. star: ${solution(false)}`)
console.log(`2. star: ${solution(true)}`)
