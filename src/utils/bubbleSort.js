export default {
  sort (array, registerComparisonCb, registerSwitchCb, registerSetCb) {
    const arrayCopy = array.slice()
    for (let i = 0; i < arrayCopy.length; i++) {
      let k = 0
      for (let j = 1; j < arrayCopy.length - i; j++, k++) {
        registerComparisonCb(k, j)
        if (arrayCopy[k] > arrayCopy[j]) {
          const temp = arrayCopy[j]
          arrayCopy[j] = arrayCopy[k]
          arrayCopy[k] = temp
          registerSwitchCb(k, j)
        }
      }
    }

    return arrayCopy
  }
}
