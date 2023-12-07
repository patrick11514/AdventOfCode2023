import { getLines } from './lib'

//const lines = getLines('testInput.txt')
const lines = getLines('input.txt')

const enumToString = (type: types) => {
    const data = ['HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind']

    return data[type]
}

enum types {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

const getType = (cards: string[], joker = false) => {
    let same: Record<string, number> = {}

    cards.forEach((card) => {
        if (same[card]) {
            same[card]++
        } else {
            same[card] = 1
        }
    })

    const data = Object.entries(same)

    data.sort((a, b) => {
        return b[1] - a[1]
    })

    if (data.length == 5) {
        return types.HighCard
    }
    if (data.length == 4) {
        return types.OnePair
    }
    if (data.length == 3) {
        if (data[0][1] == 2) {
            return types.TwoPair
        } else if (data[0][1] == 3) {
            if (data[1][1] == 2) {
                return types.FullHouse
            } else {
                return types.ThreeOfAKind
            }
        }
    }
    if (data.length == 2) {
        if (data[0][1] == 4) {
            return types.FourOfAKind
        }
        return types.FullHouse
    }
    return types.FiveOfAKind
}

const solution = (second: boolean) => {
    const cards =
        second === false
            ? ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
            : ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

    const hands: {
        cards: string[]
        type: types
        bid: number
    }[] = []

    lines.forEach((line) => {
        const [cardsStr, bid] = line.split(' ')
        const cards = cardsStr.split('')

        let type: types

        if (!second) {
            type = getType(cards)
        } else {
            const noJoker = [...new Set(cards.filter((c) => c != 'J'))]
            const allTypes: types[] = []
            let cardsCopy = structuredClone(cards)

            for (const card of noJoker) {
                const newCards = cardsCopy.map((c) => (c == 'J' ? card : c))
                allTypes.push(getType(newCards))
            }

            if (allTypes.length == 0) {
                type = getType(cards)
            } else {
                type = allTypes.reduce((a, b) => (a > b ? a : b))
            }
        }

        hands.push({
            cards,
            type,
            bid: parseInt(bid.trim()),
        })
    })

    //tikz

    hands.sort((a, b) => {
        if (a.type != b.type) {
            return a.type - b.type
        }

        for (let i = 0; i < a.cards.length; i++) {
            const aCard = a.cards[i]
            const bCard = b.cards[i]
            const aIndex = cards.findIndex((value) => value == aCard)
            const bIndex = cards.findIndex((value) => value == bCard)

            if (aIndex === undefined || bIndex == undefined) return 0

            if (aIndex != bIndex) {
                return bIndex - aIndex
            }
        }

        return 0
    })

    let sum = 0

    hands.forEach((hand, index) => {
        sum += hand.bid * (index + 1)
    })
    return sum
}

console.log(`1.star ${solution(false)}`)
console.log(`2.star ${solution(true)}`)
