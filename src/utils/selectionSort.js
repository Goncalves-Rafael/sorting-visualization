export default {
  sort (array, switchElementsFunction, comparisonFunction) {
    const arrayCopy = array.slice()

    for (let i = 0; i < arrayCopy.length; i++) {
      let min = i
      for (let j = i; j < arrayCopy.length; j++) {
        if (comparisonFunction(j, min, i, arrayCopy) < 0) min = j
      }
      switchElementsFunction(arrayCopy, i, min)
    }

    return arrayCopy
  }
}
