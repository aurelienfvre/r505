<template>
  <div>
    <h2>Monkey Emojis</h2>
    <span v-for="(monkey, index) in monkeys" :key="index" @mouseover="monkey.hasEyesOpen = true" @mouseout="monkey.hasEyesOpen = false">
      {{ monkey.hasEyesOpen ? '🙉' : '🙈' }}
    </span>
    <br/>
    <button @click="addMonkey">Add monkey</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      monkeys: [
        { hasEyesOpen: false }
      ]
    }
  },
  methods: {
    addMonkey() {
      this.monkeys.push({ hasEyesOpen: false })
    }
  }
}
</script>

<style scoped>
span { font-size: 2rem; margin: 0 5px; }
button { margin-top: 10px; }
</style>