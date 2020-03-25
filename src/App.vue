<template>
  <div id="app">
    <div class="sidebar">
      <button  @click="randomize">
        Randomize!
      </button>
      <button  @click="reset">
        Reset!
      </button>
      <button  @click="selectionSort">
        Selection
      </button>
      <button  @click="bubbleSort">
        Bubble
      </button>
      <button id="sort-button" @click="mergeSort">
        Mergesort!
      </button>
    </div>
    <div class="flex-container">
      <div
        v-for="(item,index) in itens"
        :key="index"
        :class="{'item': true, 'comparing-first': index === comparingFirst, 'comparing-second': index === comparingSecond, 'selected': index === selected, 'finished': finished}"
        :style="`height: ${(item/max)*100}%;`">
          {{item}}
      </div>
    </div>
  </div>
</template>

<script>
import selectionSort from './utils/selectionSort'
import mergeSort from './utils/mergeSort'
import bubbleSort from './utils/bubbleSort'

export default {
  name: 'App',
  data: function () {
    return {
      itens: [],
      itensCopy: [],
      max: 200,
      min: 20,
      current: 0,
      intervalId: null,
      clearIntervalId: null,
      dispatchedChanges: {},
      dispatchedComparisons: {},
      dispachedSets: {},
      comparingFirst: null,
      comparingSecond: null,
      selected: null,
      finished: false
    }
  },
  mounted () {
    this.clearHistory()
    this.generateRandomArray(50)
    clearInterval(this.intervalId)
    clearInterval(this.clearIntervalId)
  },
  methods: {
    generateRandomArray (size = 20) {
      for (let i = 0; i < size; i++) {
        const newRand = Math.ceil(Math.random() * (100) + 10)
        if (this.itens.find(el => el === newRand)) {
          i--
          continue
        }
        this.itens.push(newRand) // TODO:
      }
      this.max = Math.max(...this.itens) + 10
      this.interval = setInterval(this.sort, 1000)
    },
    dispatchChanges (first, second, step = first) {
      if (!this.dispatchedChanges.changes[step]) {
        this.dispatchedChanges.steps.push(step)
        this.dispatchedChanges.changes[step] = []
      }
      this.dispatchedChanges.changes[step].push([first, second])
    },
    dispatchComparisons (first, second, step) {
      if (!this.dispatchedComparisons[step]) this.dispatchedComparisons[step] = { indexes: [] }
      this.dispatchedComparisons[step].indexes.push([first, second])
    },
    dispatchSets (array, index, value, step) {
      if (!this.dispatchedSets.sets[step]) {
        this.dispatchedSets.steps.push(step)
        this.dispatchedSets.sets[step] = []
      }
      this.dispatchedSets.sets[step].push([index, value])
    },
    selectionSort () {
      this.clearHistory()
      this.itensCopy = this.itens.slice()
      this.clearHistory()
      if (!this.intervalId) {
        this.intervalId = setInterval(this.commitDispatchesFactory(this.commitDispatchedChange), 20)
      }
      selectionSort.sort(
        this.itens,
        this.switchElementsFactory(this.dispatchChanges),
        this.comparisonFactory(this.dispatchComparisons)
      )
    },
    bubbleSort () {
      this.clearHistory()
      this.itensCopy = this.itens.slice()
      this.clearHistory()
      if (!this.intervalId) {
        this.intervalId = setInterval(this.commitDispatchesFactory(this.commitDispatchedChange), 20)
      }
      bubbleSort.sort(
        this.itens,
        this.switchElementsFactory(this.dispatchChanges),
        this.comparisonFactory(this.dispatchComparisons)
      )
    },
    reset () {
      this.itens = this.itensCopy
    },
    randomize () {
      this.clearHistory()
      this.itens = []
      this.generateRandomArray(50)
      clearInterval(this.intervalId)
      clearInterval(this.clearIntervalId)
    },
    mergeSort () {
      this.clearHistory()
      this.itensCopy = this.itens.slice()
      if (!this.intervalId) {
        this.intervalId = setInterval(this.commitDispatchesFactory(this.commitDispatchedSet), 50)
      }
      mergeSort.sort(
        this.itens,
        this.setElementFactory(this.dispatchSets),
        this.comparisonFactory((firstEl, secondEl, step) => {
          const firstIndex = this.itens.findIndex(el => el === firstEl)
          const secondIndex = this.itens.findIndex(el => el === secondEl)
          this.dispatchComparisons(firstIndex, secondIndex, step)
        })
      )
    },
    switchElementsDefault (array, first, second) {
      const temp = array[first]
      array[first] = array[second]
      array[second] = temp
    },
    setElementsDefault (array, index, value) {
      array[index] = value
    },
    switchElementsFactory (registerSwitchCb, switchFunction = this.switchElementsDefault) {
      return function (array, first, second, step) {
        // console.log('switch')
        switchFunction(array, first, second)
        if (registerSwitchCb) registerSwitchCb(first, second, step)
      }
    },
    comparisonFactory (registerComparisonCb, compareFunction = (a, b) => a - b) {
      return function (first, second, step, array) {
        // console.log('comparison')
        if (registerComparisonCb) registerComparisonCb(first, second, step, array)
        return array ? compareFunction(array[first], array[second]) : compareFunction(first, second)
      }
    },
    setElementFactory (registerSetCb) {
      return function (array, index, value, step) {
        if (registerSetCb) registerSetCb(array, index, value, step)
        array[index] = value
      }
    },
    commitDispatchesFactory (commitDispatchFunction) {
      return function () {
        try {
          commitDispatchFunction()
          this.$forceUpdate()
        } catch (e) {
          if (!this.clearIntervalId) {
            this.clearIntervalId = setTimeout(this.killInterval, 200)
          }
        }
      }.bind(this)
    },
    commitDispatchedChange () {
      const step = this.dispatchedChanges.steps[0]
      if (this.dispatchedComparisons[step].indexes.length <= 0) {
        if (this.dispatchedChanges.changes[step].length <= 0) {
          this.dispatchedChanges.steps.splice(0, 1)
        } else {
          const change = this.dispatchedChanges.changes[step][0]
          this.comparingFirst = parseInt(change[0])
          this.switchElementsDefault(this.itens, change[0], change[1])
          this.dispatchedChanges.changes[step].splice(0, 1)
          // console.log('commitDispatchedChange')
        }
      } else {
        this.commitDispatchedComparison(step, true)
      }
    },
    commitDispatchedSet () {
      const step = this.dispatchedSets.steps[0]
      if (this.dispatchedComparisons[step].indexes.length <= 0) {
        if (this.dispatchedSets.sets[step].length <= 0) {
          this.dispatchedSets.steps.splice(0, 1)
        } else {
          const set = this.dispatchedSets.sets[step][0]
          this.selected = parseInt(set[0])
          this.setElementsDefault(this.itens, set[0], set[1])
          this.dispatchedSets.sets[step].splice(0, 1)
          // console.log('commitDispatchedSet')
        }
      } else {
        this.commitDispatchedComparison(step)
      }
    },
    commitDispatchedComparison (step, selected) {
      const indexes = this.dispatchedComparisons[step].indexes[0]
      this.selected = selected ? step : null
      this.comparingFirst = indexes[0]
      this.comparingSecond = indexes[1]
      this.dispatchedComparisons[step].indexes.splice(0, 1)
      // console.log('commitDispatcheDComparison')
    },
    killInterval () {
      if (this.dispatchedChanges.steps.length === 0 && this.intervalId) {
        clearInterval(this.intervalId)
        clearInterval(this.clearIntervalId)
        this.intervalId = null
        this.clearIntervalId = null
        this.intervalId = setInterval(function () {
          this.finished = !this.finished
        }.bind(this), 100)
        this.comparingFirst = null
        this.comparingSecond = null
        this.selected = null
        setTimeout(this.finish, 1500)
      }
    },
    finish () {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.finished = false
    },
    clearHistory () {
      this.dispatchedSets = {
        steps: [],
        sets: []
      }
      this.dispatchedChanges = {
        steps: [],
        changes: []
      }
      this.dispatchedComparisons = {}
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body, html {
    color: white;
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-color: rgb(223,226,241);
}

#app {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background-color: rgb(231,238,247);
  border-radius: 20px;
  box-shadow: 0px 10px 108px -25px rgba(102,102,102,1);
}

.sidebar,
.flex-container {
  height: 100%;
  display: inline-block;
}

.sidebar {
  display: inline-flex;
  width: 20%;
  flex-direction: column;
  background-color: #6252FF;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.sidebar > * {
  margin: auto;
}

.sidebar button {
  height: 40px;
  border-radius: 30px;
  width: 80%;
  border-style: none;
  background-color: white;
  font-weight: 800;
  /* text-transform: uppercase; */
  font-size: larger;
  font-family: 'Roboto', sans-serif;
  color: #6252FF;
  outline: 0;
}

#sort-button {
  margin-bottom: 30px;
}

button:hover {
  cursor: pointer;
}

.flex-container {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto;
  position: inherit;
  width: 80%;
}

.item {
  display: inline-block;
  width: 6px;
  margin-left: 8px;
  background-color: #4596FF;
  color: transparent;
  border-radius: 20px;
}

.unselected {
  background-color: #4596FF;
}

.selected {
  background-color: #9185FF;
}

.comparing-first {
  background-color: red;
}

.comparing-second {
  background-color: yellow;
}

.finished {
  background-color: lime;
}

</style>
