import { toUpperCase } from "zod"
import { time } from "zod/v4/core/regexes.cjs"

export function generateOrderNumber(){
    const timeStamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).slice(2,7).toUpperCase()
    return `ORD-${timeStamp}-${random}`
}

