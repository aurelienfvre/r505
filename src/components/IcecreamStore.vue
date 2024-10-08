<template>
  <div id="icecream-store">
    <h2>Icecream store</h2>

    <label>Quantity: <input type="number" v-model.number="quantity"></label>

    <label>Size:
      <select v-model.number="size">
        <option value="100">Small</option>
        <option value="150">Medium</option>
        <option value="200">Giant</option>
      </select>
    </label>

    <label>Flavour:</label>
    <label><input type="radio" v-model="flavour" value="#F3E5AB">Vanilla</label>
    <label><input type="radio" v-model="flavour" value="#5B2F00">Chocolate</label>
    <label><input type="radio" v-model="flavour" value="#DE0934">Strawberry</label>

    <label><input type="checkbox" v-model="napkin"> Napkin</label>

    <div class="icecream-display">
      <div v-for="n in quantity" :key="n" class="icecream" :style="{ backgroundColor: flavour, height: size + 'px', width: size + 'px' }"></div>
    </div>
    <div v-if="napkin">🍽️</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quantity: 1,
      flavour: "#5B2F00",
      size: 150,
      napkin: true
    }
  }
}
</script>

<style scoped>
label { display: block; margin: 10px 0; }
.icecream-display { display: flex; justify-content: center; margin-top: 20px; }
.icecream { border-radius: 50% 50% 0 0; margin: 0 10px; }
</style>