<template>
  <ol>
    <li>
      <span class="ghost joyful" :style="ghost1.style">👻︎</span>
      I'm joyful and red
    </li>
    <li>
      <span class="ghost jelly" :style="ghost2.style">👻︎</span>
      I'm jelly and green
    </li>
    <li>
      <span class="ghost" :class="{ wobbly: ghost3.isWobbly }" :style="{ color: ghost3.isBlue ? 'blue' : '' }">👻︎</span>
      I'm wobbly and blue
    </li>
  </ol>
</template>

<script>
export default {
  data() {
    return {
      ghost1: {
        style: { color: 'red' }
      },
      ghost2: {
        style: { color: 'green' }
      },
      ghost3: {
        isWobbly: true,
        isBlue: true
      }
    }
  }
}
</script>

<style>
.ghost {
  font-size: 4rem;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5em;
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes joyful {
  0% { transform: scaleX(1) }
  10%, 20% { transform: scale3d(.9,.9,.9) rotate(-3deg) }
  30%, 50%, 70%, 90% { transform: scale3d(1.1,1.1,1.1) rotate(3deg) }
  40%, 60%, 80% { transform: scale3d(1.1,1.1,1.1) rotate(-3deg) }
  to { transform: scaleX(1) }
}

.joyful {
  animation-name: joyful;
}

@keyframes jelly {
  0%, 11.1%, to { transform: none }
  22.2% { transform: skewX(-12.5deg) skewY(-12.5deg) }
  33.3% { transform: skewX(6.25deg) skewY(6.25deg) }
  44.4% { transform: skewX(-3.125deg) skewY(-3.125deg) }
  55.5% { transform: skewX(1.5625deg) skewY(1.5625deg) }
  66.6% { transform: skewX(-.78125deg) skewY(-.78125deg) }
  77.7% { transform: skewX(.390625deg) skewY(.390625deg) }
  88.8% { transform: skewX(-.1953125deg) skewY(-.1953125deg) }
}

.jelly {
  animation-name: jelly;
  transform-origin: center;
}

@keyframes wobbly {
  0% { transform: none }
  15% { transform: translate3d(-25%,0,0) rotate(-5deg) }
  30% { transform: translate3d(20%,0,0) rotate(3deg) }
  45% { transform: translate3d(-15%,0,0) rotate(-3deg) }
  60% { transform: translate3d(10%,0,0) rotate(2deg) }
  75% { transform: translate3d(-5%,0,0) rotate(-1deg) }
  to { transform: none }
}

.wobbly {
  animation-name: wobbly;
}
</style>