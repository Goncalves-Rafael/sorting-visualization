let compare = null
let set = null
let step = 0

export default {
  sort (array, setElementFunction, comparisonFunction) {
    const arrayCopy = array.slice()
    set = setElementFunction
    compare = comparisonFunction
    step = 0
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
    if (R.length === 0) debugger

    while (i < half1 && j < half2) {
      if (compare(L[i], R[j], step) > 0) {
        set(array, k, L[i], step)
        k++
        i++
      } else {
        set(array, k, R[j], step)
        k++
        j++
      }
    }

    while (i < half1) {
      set(array, k, L[i], step)
      k++
      i++
    }

    while (j < half2) {
      set(array, k, R[j], step)
      k++
      j++
    }

    step++
  }

}
