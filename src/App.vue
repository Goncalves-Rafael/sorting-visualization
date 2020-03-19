<template>
  <div id="app">
    <button @click="selectionSort"/>
    <div
      v-for="(item,index) in itens"
      :key="index"
      :class="{'item': true, 'selected-first': index === selectedFirst, 'selected-second': index === selectedSecond, 'finished': finished}"
      :style="`height: ${(item/max)*100}%;`">
        {{item}}
    </div>
  </div>
</template>

<script>
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
    this.generateRandomArray(30)
  },
  methods: {
    generateRandomArray (size = 20) {
      for (let i = 0; i < size; i++) {
        this.itens.push(Math.ceil(Math.random() * (100) + 10)) // TODO:
      }
      this.max = Math.max(...this.itens) + 10
      this.interval = setInterval(this.sort, 1000)
    },
    switchElements (first, second, array) {
      const temp = array[first]
      array[first] = array[second]
      array[second] = temp
    },
    selectionSort () {
      const arrayCopy = this.itens.slice()
      if (!this.intervalId) {
        this.intervalId = setInterval(this.commitDispatches, 20)
      }
      for (let i = 0; i < arrayCopy.length; i++) {
        let min = i
        for (let j = i; j < arrayCopy.length; j++) {
          if (arrayCopy[j] < arrayCopy[min]) min = j
          if (!this.dispatchedComparisons[i]) this.dispatchedComparisons[i] = { compareWith: [] }
          this.dispatchedComparisons[i].compareWith.push(j)
        }
        this.switchElements(i, min, arrayCopy)
        this.dispatchedChanges.push([i, min])
      }
    },
    commitDispatches () {
      try {
        const change = this.dispatchedChanges[0]
        if (this.dispatchedComparisons[change[0]].compareWith.length <= 0) {
          this.selected = parseInt(change[0])
          this.switchElements(change[0], change[1], this.itens)
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
        setTimeout(this.finish, 1500)
      }
    },
    finish () {
      clearInterval(this.intervalId)
      this.finished = false
      this.selectedFirst = null
      this.selectedSecond = null
    }
  }
}
</script>

<style>
body, html {
    color: white;
    margin: 0px;
    padding: 0px;
    height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.item {
  display: inline-block;
  width: 5px;
  margin-left: 4px;
  background-color: cyan;
  flex: none;
  color: transparent;
}

.unselected {
  background-color: cyan;
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
