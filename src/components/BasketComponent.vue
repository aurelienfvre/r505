<template>
  <div id="basket">
    <h1>Fruit Shop</h1>

    <div class="fruit-buttons">
      <button v-for="fruit in availableFruits" :key="fruit.type" @click="addToBasket(fruit)">
        {{ fruit.type }} - ${{ fruit.price.toFixed(2) }}
      </button>
    </div>

    <h2>Your Basket:</h2>
    <ul v-if="basketItems.length > 0">
      <li v-for="item in basketItems" :key="item.type">
        {{ item.type }} x {{ item.quantity }} - ${{ (item.price * item.quantity).toFixed(2) }}
        <button @click="removeFromBasket(item)">Remove</button>
      </li>
    </ul>
    <p v-else>Your basket is empty</p>

    <h3>Total: ${{ totalPrice.toFixed(2) }}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      availableFruits: [
        { type: '🍌', price: 0.5 },
        { type: '🍎', price: 0.7 },
        { type: '🍒', price: 1.0 },
        { type: '🍉', price: 2.5 },
      ],
      basketItems: []
    }
  },
  computed: {
    totalPrice() {
      return this.basketItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },
  methods: {
    addToBasket(fruit) {
      const existingItem = this.basketItems.find(item => item.type === fruit.type);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.basketItems.push({ ...fruit, quantity: 1 });
      }
    },
    removeFromBasket(item) {
      const index = this.basketItems.findIndex(basketItem => basketItem.type === item.type);
      if (index !== -1) {
        if (this.basketItems[index].quantity > 1) {
          this.basketItems[index].quantity--;
        } else {
          this.basketItems.splice(index, 1);
        }
      }
    }
  }
}
</script>

<style scoped>
#basket {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.fruit-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

button {
  font-size: 1.2rem;
  padding: 10px 15px;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

h1, h2, h3 {
  text-align: center;
}
</style>