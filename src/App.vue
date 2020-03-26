<template>
  <div id="app">
    <div class="sidebar">
      <div id="controls-buttons">
        <button  @click="randomize">
          Randomize!
        </button>
        <button  @click="reset">
          Reset!
        </button>
      </div>
      <div id="sorting-algorithms" >
        <div v-for="algorithm in sortingAlgorithms"
          :key="algorithm.name"
          :value="algorithm.implementation"
          :class="{'sorting-select': sortingFunction == algorithm.implementation}"
          @click="selectAlgorithm(algorithm.implementation)">
          {{algorithm.name}}
        </div>
      </div>
      <button id="sort-button" @click="sort">
        Sort!
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

const DEFAULT_LENGTH = 50

export default {
  name: 'App',
  data: function () {
    return {
      itens: [],
      itensCopy: [],
      max: 200,
      min: 20,
      intervalId: null,
      clearIntervalId: null,
      dispatchedActions: [],
      currentIndex: 0,
      comparingFirst: null,
      comparingSecond: null,
      selected: null,
      finished: false,
      sortingAlgorithms: [],
      sortingFunction: null
    }
  },
  created () {
    this.sortingFunction = bubbleSort
    this.sortingAlgorithms.push({
      name: 'MergeSort',
      implementation: mergeSort
    })
    this.sortingAlgorithms.push({
      name: 'BubbleSort',
      implementation: bubbleSort
    })
    this.sortingAlgorithms.push({
      name: 'SelectionSort',
      implementation: selectionSort
    })
  },
  mounted () {
    this.clearState()
    this.generateRandomArray(DEFAULT_LENGTH)
  },
  methods: {
    generateRandomArray (size = DEFAULT_LENGTH) {
      this.itens = []
      this.itensCopy = []
      for (let i = 0; i < size; i++) {
        const newRand = Math.ceil(Math.random() * (100) + 10)
        if (this.itens.find(el => el === newRand)) {
          i--
          continue
        }
        this.itens.push(newRand) // TODO:
      }
      // this.max = Math.max(...this.itens) + 10
      // this.interval = setInterval(this.sort, 1000)
    },
    selectAlgorithm (algorithm) {
      this.sortingFunction = algorithm
    },
    sort () {
      if (this.itensCopy.length === 0) {
        this.itensCopy = this.itens.slice()
      } else {
        this.reset()
      }
      this.clearState()
      if (!this.intervalId) {
        this.intervalId = setInterval(this.commitActions, 20)
      }
      this.sortingFunction.sort(
        this.itens,
        this.registerComparison,
        this.registerSwitch,
        this.registerSet
      )
    },
    registerComparison (a, b) {
      this.dispatchedActions.push({
        type: 'comparison',
        targets: [a, b]
      })
    },
    commitComparison (comparisonAction) {
      this.comparingFirst = comparisonAction.targets[0]
      this.comparingSecond = comparisonAction.targets[1]
    },
    registerSet (a, value) {
      this.dispatchedActions.push({
        type: 'set',
        targets: [a, value]
      })
    },
    commitSet (setAction) {
      this.selected = setAction.targets[0]
      this.itens[this.selected] = setAction.targets[1]
    },
    registerSwitch (a, b) {
      this.dispatchedActions.push({
        type: 'switch',
        targets: [a, b]
      })
    },
    commitSwitch (switchAction) {
      this.comparingFirst = switchAction.targets[0]
      this.comparingSecond = switchAction.targets[1]
      const temp = this.itens[this.comparingFirst]
      this.$set(this.itens, this.comparingFirst, this.itens[this.comparingSecond])
      this.$set(this.itens, this.comparingSecond, temp)
    },
    commitActions () {
      try {
        if (this.dispatchedActions.length <= this.currentIndex) {
          return this.killInterval()
        }
        const action = this.dispatchedActions[this.currentIndex]
        if (action.type === 'switch') {
          this.commitSwitch(action)
        } else if (action.type === 'comparison') {
          this.commitComparison(action)
        } else {
          this.commitSet(action)
        }
        this.currentIndex++
      } catch (err) {
        console.log(err)
        this.killInterval()
      }
    },
    reset () {
      if (this.itensCopy && this.itensCopy.length > 0) this.itens = this.itensCopy.slice()
      this.clearState()
    },
    randomize () {
      this.clearState()
      this.generateRandomArray()
    },
    killInterval () {
      if (this.dispatchedActions.length <= this.currentIndex && this.intervalId) {
        clearInterval(this.intervalId)
        clearInterval(this.clearIntervalId)
        this.intervalId = setInterval(function () {
          this.finished = !this.finished
        }.bind(this), 100)
        this.comparingFirst = null
        this.comparingSecond = null
        this.selected = null
        setTimeout(this.clearState, 1500)
      }
    },
    clearState () {
      clearInterval(this.intervalId)
      clearInterval(this.clearIntervalId)
      this.dispatchedActions = []
      this.currentIndex = 0
      this.comparingFirst = null
      this.comparingSecond = null
      this.selected = null
      this.intervalId = null
      this.clearIntervalId = null
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

#controls-buttons {
  display: flex;
  margin-top: 0px;
  width: 100%;
  height: 4rem;
  box-shadow: 0px 3px 0px 0px rgba(0,0,0,0.15);
}

#controls-buttons button{
  border-style: none;
  font-weight: 800;
  font-family: 'Roboto', sans-serif;
  /* text-transform: uppercase; */
  font-size: larger;
  border-style: none;
  outline: 0;
  flex-grow: 1;
}

#controls-buttons button:first-child{
  border-top-left-radius: 20px;
  background-color: white;
  color: #4036a3;
}

#controls-buttons button:nth-child(2){
  background-color: #4036a3;
  color: white;
}

#controls-buttons button:hover {
  font-size: x-large;
}

#sorting-algorithms {
  width: 100%;
  text-align: center;
  background-color: #4036a3;
  display: flex;
  flex-direction: column;
}

#sorting-algorithms div {
  font-size: x-large;
  background-color: #4036a3;
  color: rgba(0,0,0, .3);
  padding: 20px 0px;
  border: none;
  font-weight: 800;
  font-family: 'Roboto', sans-serif;
  /* text-transform: uppercase; */
  font-size: larger;
  cursor: pointer;
  transition: all .5s ease-in-out;
}

#sorting-algorithms div:hover {
  color: white;
}

#sorting-algorithms div.sorting-select {
  background-color: white;
  color: #4036a3;
  position: relative;
}

#sorting-algorithms div.sorting-select::after {
  content: ' ';
  display: inline-block;
  transform: rotate(45deg);
  height: 17px;
  width: 9px;
  border-bottom: 4px solid #4036a3;
  border-right: 4px solid #4036a3;
  position: absolute;
  right: 30px;
}

#sort-button {
  margin-bottom: 30px;
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
  box-shadow: inset 7px 0 9px -7px rgba(0,0,0,0.7);
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
