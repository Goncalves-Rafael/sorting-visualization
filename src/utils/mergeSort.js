let registerComparison = null
let registerSet = null

export default {
  sort (array, registerComparisonCb, registerSwitchCb, registerSetCb) {
    const arrayCopy = array.slice()
    registerComparison = registerComparisonCb
    registerSet = registerSetCb
    this.mergeSort(arrayCopy, 0, array.length - 1)
  },
  mergeSort (array, left, right) {
    if (left < right) {
      const middle = left + Math.floor(((right - left) / 2))
      this.mergeSort(array, left, middle)
      this.mergeSort(array, middle + 1, right)
      this.merge(array, left, middle, right)
    }
  },
  merge (array, left, middle, right) {
    let i, j, k
    const half1 = middle - left + 1
    const half2 = right - middle
    const L = array.slice(left, left + half1)
    const R = array.slice(left + half1, right + 1)
    i = 0
    j = 0
    k = left

    while (i < half1 && j < half2) {
      registerComparison(left + i, middle + j)
      if (L[i] < R[j]) {
        array[k] = L[i]
        registerSet(k, L[i])
        k++
        i++
      } else {
        array[k] = R[j]
        registerSet(k, R[j])
        k++
        j++
      }
    }

    while (i < half1) {
      registerSet(k, L[i])
      array[k] = L[i]
      k++
      i++
    }

    while (j < half2) {
      registerSet(k, R[j])
      array[k] = R[j]
      k++
      j++
    }
  }

}
