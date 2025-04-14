<template>
  <transition name="fade-zoom">
    <div
      v-if="show"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm overflow-hidden"
    >
      <!-- Firework Icons -->
      <span
        v-for="(icon, i) in fireworks"
        :key="i"
        class="firework-icon select-none"
        :style="fireworkStyle(i)"
        aria-hidden="true"
      >
        {{ icon }}
      </span>
      <div class="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg animate-bounce relative z-10">
        {{ message }}
      </div>
      <button
        v-if="showRestart"
        @click="$emit('restart')"
        class="mt-8 px-8 py-3 text-xl font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg transition relative z-10"
      >
        {{ t('playAgain') }}
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// @ts-ignore
const { t } = useI18n()
const props = defineProps<{
  show: boolean,
  message: string,
  showRestart?: boolean,
  type?: 'win' | 'gameover'
}>()

// Icon sets for win and game over
const winIcons = [
  '🎉', '🎆', '🧨', '✨', '🎇', '💥', '🔥', '🌟', '🥳', '🎊'
]
const loseIcons = [
  '💀', '😭', '💣', '🪦', '😵', '😢', '🥀', '☠️', '🕳️', '🫥'
]

// Number of icons to show
const NUM_FIREWORKS = 14

// Pick icon set based on type
const iconList = computed(() => props.type === 'win' ? winIcons : loseIcons)

// Randomize emoji selection
const fireworks = computed(() => {
  return Array.from({ length: NUM_FIREWORKS }, (_, i) => {
    return iconList.value[Math.floor(Math.random() * iconList.value.length)]
  })
})

// Generate a random style for each icon
function fireworkStyle(i: number) {
  // Use Math.random but seed with index for SSR consistency
  const rand = (seed: number) => {
    let x = Math.sin(seed + (props.show ? Date.now() : 0)) * 10000
    return x - Math.floor(x)
  }
  // Position: anywhere in the overlay
  const top = rand(i * 9 + 1) * 80 + 5 // 5% to 85%
  const left = rand(i * 7 + 2) * 80 + 5
  // Animation duration and delay
  const duration = 1.1 + rand(i * 5 + 3) * 1.2 // 1.1s to 2.3s
  const delay = rand(i * 11 + 4) * 0.7 // 0s to 0.7s
  // Random scale and rotation
  const scale = 0.9 + rand(i * 13 + 5) * 0.8
  const rotate = rand(i * 17 + 6) * 360 - 180

  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    transform: `scale(${scale}) rotate(${rotate}deg)`
  }
}
</script>

<style scoped>
.fade-zoom-enter-active, .fade-zoom-leave-active {
  transition: all 0.5s cubic-bezier(.68,-0.55,.27,1.55);
}
.fade-zoom-enter-from, .fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
.fade-zoom-enter-to, .fade-zoom-leave-from {
  opacity: 1;
  transform: scale(1);
}
.firework-icon {
  position: absolute;
  font-size: 2.5rem;
  pointer-events: none;
  opacity: 0;
  z-index: 1;
  animation: firework-pop 1.6s cubic-bezier(.68,-0.55,.27,1.55) forwards;
}
@keyframes firework-pop {
  0% {
    opacity: 0;
    transform: scale(0.2) translateY(40px) rotate(0deg);
  }
  20% {
    opacity: 1;
    transform: scale(1.1) translateY(-10px) rotate(20deg);
  }
  70% {
    opacity: 1;
    transform: scale(1) translateY(-30px) rotate(-20deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.7) translateY(-70px) rotate(0deg);
  }
}
</style>
