export default {
  sort (array, registerComparisonCb, registerSwitchCb, registerSetCb) {
    const arrayCopy = array.slice()

    for (let i = 0; i < arrayCopy.length; i++) {
      let min = i
      for (let j = i; j < arrayCopy.length; j++) {
        if (arrayCopy[j] < arrayCopy[min]) min = j
        registerComparisonCb(i, j)
      }
      const temp = arrayCopy[i]
      arrayCopy[i] = arrayCopy[min]
      arrayCopy[min] = temp
      registerSwitchCb(i, min)
    }

    return arrayCopy
  }
}
