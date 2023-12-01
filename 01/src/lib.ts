import fs from 'node:fs'
import path from 'node:path'

export const getLines = (fileName: string) => {
    const file = fs.readFileSync(path.join(__dirname, fileName), 'utf-8').trim()
    const lines = file.split('\n').map((line) => line.trim())

    return lines
}

export const is_numeric = (str: string) => {
    return /^\d+$/.test(str)
}
