import { DrawError } from './errors'


const getCandidateList = (email, blacklist, pool) => (
  // accept candidates that are...
  pool.filter(candidate =>
    candidate.email !== email                 // not self
    && !blacklist.includes(candidate.email)   // not blacklisted
    && !candidate.picked                      // not already picked
  )
)

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)]

const draw = pool => {
  pool.forEach((giver, index, arr) => {
    const candidates = getCandidateList(giver.email, giver.blacklist, arr)
    if (candidates.length > 0) {
      const receiver = getRandom(candidates)
      arr[index].receiver = { name: receiver.name, email: receiver.email }
      arr[arr.indexOf(receiver)].picked = true
    } else {
      throw new DrawError(`There are no available receivers for current giver (${giver.email}). Pool now: ${JSON.stringify(arr, true, 2)}`)
    }
  })
  return pool
}

export const drawUntilSuccess = (poolFn, attempt = 1) => {
  let result
  try {
    result = draw(poolFn())
    // result.forEach(giver => console.log(`${giver.name} --> ${giver.receiver.name}`))
    // console.log(`Success at attempt n:o ${attempt}`)
    return result
  } catch (e) {
    if (e instanceof DrawError && attempt < 100) {
      drawUntilSuccess(poolFn(), ++attempt)
    } else if (e instanceof DrawError) {
      throw new Error('Too many attempts')
    } else {
      throw e
    }
  }
}
