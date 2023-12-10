import clc from 'cli-color'
import { getLines } from './lib'

const lines = getLines('testInput.txt')
//const lines = getLines('input.txt')

type coord = {
    y: number ///< Line number
    x: number ///< Index in line
}

enum Status {
    Unchecked,
    Checked,
}

const characters = ['|', '-', 'L', 'J', '7', 'F', 'S', '.', 'O', 'I'] as const

type pipe = (typeof characters)[number]

type charInfo = {
    char: pipe
    distance: number
    status: Status
    isValid: boolean
}

let start: undefined | coord
const pipesMap: charInfo[][] = lines.map((line) =>
    line.split('').map((line) => {
        return {
            char: line as pipe,
            distance: -1,
            status: Status.Unchecked,
            isValid: true,
        }
    }),
)

const get = (coord: coord) => {
    const row = pipesMap[coord.y]

    return row === undefined ? undefined : row[coord.x] ?? undefined
}

const scanSurrounding1 = (coord: coord) => {
    const symbol = get(coord)?.char

    const nextPipes: coord[] = []

    if (!symbol) return nextPipes

    //left
    const lCoord = {
        y: coord.y,
        x: coord.x - 1,
    }
    const lChar = get(lCoord)?.char
    if (['S', '-', 'J', '7'].includes(symbol)) {
        if (lChar !== undefined)
            if (['-', 'F', 'L'].includes(lChar)) {
                nextPipes.push(lCoord)
            }
    }

    //right
    const rCoord = {
        y: coord.y,
        x: coord.x + 1,
    }
    const rChar = get(rCoord)?.char
    if (['S', '-', 'F', 'L'].includes(symbol)) {
        if (rChar !== undefined)
            if (['-', 'J', '7'].includes(rChar)) {
                nextPipes.push(rCoord)
            }
    }

    //top
    const tCoord = {
        y: coord.y - 1,
        x: coord.x,
    }
    const tChar = get(tCoord)?.char
    if (['S', '|', 'L', 'J'].includes(symbol)) {
        if (tChar !== undefined)
            if (['|', '7', 'F'].includes(tChar)) {
                nextPipes.push(tCoord)
            }
    }

    //down
    const dCoord = {
        y: coord.y + 1,
        x: coord.x,
    }
    const dChar = get(dCoord)?.char
    if (['S', '|', '7', 'F'].includes(symbol)) {
        if (dChar !== undefined)
            if (['|', 'L', 'J'].includes(dChar)) {
                nextPipes.push(dCoord)
            }
    }

    return nextPipes
}

pipesMap.forEach((line, lI) =>
    line.forEach((c, cI) =>
        c.char === 'S'
            ? (start = {
                  y: lI,
                  x: cI,
              })
            : undefined,
    ),
)

const solution1 = () => {
    if (start === undefined) throw 'Cannot find start'

    const queue: coord[] = []

    pipesMap[start.y][start.x].distance = 0

    queue.push(start)

    while (queue.length !== 0) {
        const coord = queue.pop()
        if (!coord) break
        const currentPipe = get(coord)
        if (!currentPipe) break

        if (currentPipe.status !== Status.Unchecked) continue
        currentPipe.status = Status.Checked

        scanSurrounding1(coord).forEach((pipeCoord) => {
            const pipe = get(pipeCoord)

            if (!pipe) return

            if (pipe.status === Status.Unchecked) {
                queue.unshift(pipeCoord)
                pipe.distance = currentPipe.distance + 1
            }
        })
    }

    let max = -1

    pipesMap.forEach((line) => {
        line.forEach((c) => {
            if (c.distance > max) {
                max = c.distance
            }
        })
    })

    return max
}

const checkY = (l: pipe, r: pipe) => {
    if (l == 'S' || r == 'S') return false

    if (l == '-' && r == '-') return false
    if (l == '-' && r == 'J') return false
    if (l == '-' && r == '7') return false
    if (l == 'L' && r == 'J') return false
    if (l == 'F' && r == 'J') return false
    if (l == 'L' && r == '7') return false
    if (l == 'F' && r == '7') return false

    return true
}

const checkX = (u: pipe, d: pipe) => {
    if (u == 'S' || d == 'S') return false

    if (u == '|' && d == '|') return false
    if (u == '|' && d == 'L') return false
    if (u == '|' && d == 'J') return false
    if (u == 'F' && d == 'L') return false
    if (u == '7' && d == 'J') return false
    if (u == '7' && d == 'L') return false
    if (u == 'F' && d == 'J') return false

    return true
}

const scanSurrounding2 = (coord: coord) => {
    const symbol = get(coord)?.char

    const nextGround: coord[] = []

    if (!symbol) return nextGround

    for (let y = coord.y - 1; y <= coord.y + 1; y++) {
        for (let x = coord.x - 1; x <= coord.x + 1; x++) {
            if (x == coord.x && y == coord.y) continue

            const pipe = get({
                x,
                y,
            })

            if (pipe !== undefined) {
                if (pipe.distance === -1) {
                    nextGround.push({
                        x,
                        y,
                    })
                }
            }
        }
    }

    return nextGround
}

let newSchema = structuredClone(pipesMap)

const doDFS = (coord: coord) => {
    const stack: coord[] = []

    stack.push(coord)
    const data: coord[] = []

    console.log('START: ', coord)

    let isValid = true

    while (stack.length !== 0 && isValid == true) {
        const coord = stack.pop()
        if (!coord) break

        if (coord.y == 0 || coord.y == pipesMap.length - 1 || coord.x == 0 || coord.x == pipesMap[0].length - 1) {
            isValid = false
            data.push(coord)
            break
        }

        const currentPipe = get(coord)
        if (!currentPipe) break

        if (currentPipe.status !== Status.Unchecked) continue
        currentPipe.status = Status.Checked
        data.push(coord)

        /*console.log(
            coord,
            scanSurrounding2(coord).map((d) => {
                return { ...get(d), ...d }
            }),
        )*/

        scanSurrounding2(coord).forEach((pipeCoord) => {
            const pipe = get(pipeCoord)

            if (!pipe) return

            if (!pipe.isValid) {
                isValid = false
                data.push(pipeCoord)
            }

            if (pipe.status === Status.Unchecked) {
                stack.push(pipeCoord)
            }
        })
    }

    if (!isValid) {
        data.forEach((d) => {
            const c = get(d)
            if (c) c.isValid = false
        })

        if (data.length == 0) return

        console.log(data)

        newSchema.forEach((line, lI) => {
            line.forEach((c, cI) => {
                if (
                    data.some((dC) => {
                        if (dC.x == cI && dC.y == lI) {
                            return true
                        }
                        return false
                    })
                ) {
                    c.char = 'O'
                }
            })
        })

        console.log(
            pipesMap
                .map((line, lI) => {
                    return line
                        .map((c, cI) => {
                            if (
                                data.some((dC) => {
                                    if (dC.x == cI && dC.y == lI) {
                                        return true
                                    }
                                    return false
                                })
                            ) {
                                return 'O'
                            }

                            return c.char
                        })
                        .join('')
                })
                .join('\n'),
        )

        console.log('\n\n\n')

        return
    }

    newSchema.forEach((line, lI) => {
        line.forEach((c, cI) => {
            if (
                data.some((dC) => {
                    if (dC.x == cI && dC.y == lI) {
                        return true
                    }
                    return false
                })
            ) {
                c.char = 'I'
            }
        })
    })

    console.log(
        pipesMap
            .map((line, lI) => {
                return line
                    .map((c, cI) => {
                        if (
                            data.some((dC) => {
                                if (dC.x == cI && dC.y == lI) {
                                    return true
                                }
                                return false
                            })
                        ) {
                            return 'I'
                        }

                        return c.char
                    })
                    .join('')
            })
            .join('\n'),
    )

    console.log(data)

    console.log('\n\n\n')

    componentSizes.push(data.length)
}

const componentSizes: number[] = []

const createChar = (char: pipe, data: charInfo): charInfo[][] => {
    const lines: charInfo[][] = [[], [], []]

    let chars = {} as Record<pipe, charInfo>

    characters.forEach((char) => {
        chars[char] = {
            ...data,
            char,
        }
    })

    switch (char) {
        case '.': {
            lines[0].push(chars['.'], chars['.'], chars['.'])
            lines[1].push(chars['.'], chars['.'], chars['.'])
            lines[2].push(chars['.'], chars['.'], chars['.'])
            break
        }
        case '|': {
            lines[0].push(chars['.'], chars['|'], chars['.'])
            lines[1].push(chars['.'], chars['|'], chars['.'])
            lines[2].push(chars['.'], chars['|'], chars['.'])
            break
        }
        case '-': {
            lines[0].push(chars['.'], chars['.'], chars['.'])
            lines[1].push(chars['-'], chars['-'], chars['-'])
            lines[2].push(chars['.'], chars['.'], chars['.'])
            break
        }
        case 'L': {
            lines[0].push(chars['.'], chars['|'], chars['.'])
            lines[1].push(chars['.'], chars['|'], chars['.'])
            lines[2].push(chars['.'], chars['L'], chars['-'])
            break
        }
        case 'J': {
            lines[0].push(chars['.'], chars['|'], chars['.'])
            lines[1].push(chars['.'], chars['|'], chars['.'])
            lines[2].push(chars['-'], chars['J'], chars['.'])
            break
        }
        case '7': {
            lines[0].push(chars['-'], chars['7'], chars['.'])
            lines[1].push(chars['.'], chars['|'], chars['.'])
            lines[2].push(chars['.'], chars['|'], chars['.'])
            break
        }
        case 'F': {
            lines[0].push(chars['.'], chars['F'], chars['-'])
            lines[1].push(chars['.'], chars['|'], chars['.'])
            lines[2].push(chars['.'], chars['|'], chars['.'])
            break
        }
    }

    return lines
}

const solution2 = () => {
    const newPipesMap: typeof pipesMap = []

    pipesMap.forEach((line, lineIndex) => {
        const lineRows: charInfo[][] = [[], [], []]
        line.forEach((char, charIndex) => {
            const data = createChar(char.char, char)
        })
    })

    pipesMap.forEach((line, lI) => {
        line.forEach((c, cI) => {
            if (c.status === Status.Unchecked && c.distance === -1 && c.char === '.') {
                doDFS({
                    y: lI,
                    x: cI,
                })
            }
        })
    })

    console.log(componentSizes)

    return componentSizes.length == 0 ? 0 : componentSizes.reduce((prev, curr) => prev + curr)
}

console.log(`1.star: ${solution1()}`)
console.log(`2.star: ${solution2()}`)

console.log(
    newSchema
        .map((line, lineI) => {
            return line
                .map((c, cI) => {
                    if (pipesMap[lineI][cI].distance != -1) {
                        return clc.blue(c.char)
                    }

                    if (c.char == 'O') {
                        return clc.red(c.char)
                    }

                    if (c.char == 'I') {
                        return clc.green(c.char)
                    }
                    return c.char
                })
                .join('')
        })
        .join('\n'),
)
