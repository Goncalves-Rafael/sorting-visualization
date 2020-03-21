export default {
  sort (array, switchElementsFunction, comparisonFunction) {
    const arrayCopy = array.slice()
    let step = 0
    for (let i = 0; i < arrayCopy.length; i++) {
      let k = 0
      for (let j = 1; j < arrayCopy.length - i; j++, k++) {
        if (comparisonFunction(k, j, step, arrayCopy) > 0) {
          switchElementsFunction(arrayCopy, k, j, step)
          step++
        }
      }
    }

    return arrayCopy
  }
}
