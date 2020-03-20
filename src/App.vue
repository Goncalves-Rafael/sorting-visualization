<template>
  <div id="app">
    <div class="sidebar">
      <button id="sort-button" @click="selectionSort">
        Sort!
      </button>
    </div>
    <div class="flex-container">
      <div
        v-for="(item,index) in itens"
        :key="index"
        :class="{'item': true, 'selected-first': index === selectedFirst, 'selected-second': index === selectedSecond, 'finished': finished}"
        :style="`height: ${(item/max)*100}%;`">
          {{item}}
      </div>
    </div>
  </div>
</template>

<script>
import selectionSort from './utils/selectionSort'

export default {
  name: 'App',
  data: function () {
    return {
      itens: [],
      max: 200,
      min: 20,
      current: 0,
      intervalId: null,
      cleatIntervalId: null,
      dispatchedChanges: [],
      dispatchedComparisons: {},
      selectedFirst: null,
      selectedSecond: null,
      finished: false
    }
  },
  mounted () {
    this.generateRandomArray(50)
  },
  methods: {
    generateRandomArray (size = 20) {
      for (let i = 0; i < size; i++) {
        this.itens.push(Math.ceil(Math.random() * (100) + 10)) // TODO:
      }
      this.max = Math.max(...this.itens) + 10
      this.interval = setInterval(this.sort, 1000)
    },
    dispatchChanges (first, second) {
      this.dispatchedChanges.push([first, second])
    },
    dispatchComparisons (first, second) {
      if (!this.dispatchedComparisons[first]) this.dispatchedComparisons[first] = { compareWith: [] }
      this.dispatchedComparisons[first].compareWith.push(second)
    },
    selectionSort () {
      if (!this.intervalId) {
        this.intervalId = setInterval(this.commitDispatches, 20)
      }
      selectionSort.sort(
        this.itens,
        this.switchElementsFactory(this.dispatchChanges),
        this.comparisonFactory(this.dispatchComparisons)
      )
    },
    switchElementsDefault (array, first, second) {
      const temp = array[first]
      array[first] = array[second]
      array[second] = temp
    },
    switchElementsFactory (registerSwitchCb, switchFunction = this.switchElementsDefault) {
      return function (array, first, second) {
        console.log('switch')
        switchFunction(array, first, second)
        if (registerSwitchCb) registerSwitchCb(first, second)
      }
    },
    comparisonFactory (registerComparisonCb, compareFunction = (a, b) => b - a) {
      return function (array, first, second) {
        console.log('comparison')
        if (registerComparisonCb) registerComparisonCb(first, second)
        return compareFunction(array[first], array[second])
      }
    },
    commitDispatches () {
      try {
        console.log('commitDispatches')
        const change = this.dispatchedChanges[0]
        if (this.dispatchedComparisons[change[0]].compareWith.length <= 0) {
          this.selected = parseInt(change[0])
          this.switchElementsDefault(this.itens, change[0], change[1])
          this.dispatchedChanges.splice(0, 1)
        } else {
          const comparison = this.dispatchedComparisons[change[0]]
          this.selectedFirst = change[0]
          this.selectedSecond = comparison.compareWith[0]
          this.dispatchedComparisons[change[0]].compareWith.splice(0, 1)
        }
        this.$forceUpdate()
      } catch (e) {
        if (!this.cleatIntervalId) {
          setTimeout(this.killInterval, 200)
        }
      }
    },
    killInterval () {
      if (this.dispatchedChanges.length === 0 && this.intervalId) {
        clearInterval(this.intervalId)
        clearInterval(this.clearIntervalId)
        this.intervalId = null
        this.clearIntervalId = null
        this.intervalId = setInterval(function () {
          this.finished = !this.finished
        }.bind(this), 100)
        this.selectedFirst = null
        this.selectedSecond = null
        setTimeout(this.finish, 1500)
      }
    },
    finish () {
      clearInterval(this.intervalId)
      this.finished = false
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
  width: 50%;
  border-style: none;
  background-color: white;
  font-weight: 800;
  /* text-transform: uppercase; */
  font-size: larger;
  font-family: 'Roboto', sans-serif;
  color: #6252FF;
}

#sort-button {
  margin-bottom: 30px;
  outline: 0;
}

#sort-button:hover {
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

.selected-first {
  background-color: red;
}

.selected-second {
  background-color: yellow;
}

.finished {
  background-color: lime;
}

</style>
