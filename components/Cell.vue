<template>
  <div
    class="w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-150 select-none"
    :class="cellClass(cell)"
  >
    <span v-if="cell !== 0">{{ cell }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ cell: number }>()

function cellClass(cell: number) {
  switch (cell) {
    case 2: return 'bg-yellow-50 text-yellow-700'
    case 4: return 'bg-yellow-100 text-yellow-800'
    case 8: return 'bg-orange-300 text-white'
    case 16: return 'bg-orange-400 text-white'
    case 32: return 'bg-orange-500 text-white'
    case 64: return 'bg-orange-600 text-white'
    case 128: return 'bg-orange-400 text-white'
    case 256: return 'bg-orange-500 text-white'
    case 512: return 'bg-orange-600 text-white'
    case 1024: return 'bg-orange-700 text-white'
    case 2048: return 'bg-orange-800 text-white'
    default: return 'bg-orange-50 text-orange-300'
  }
}
</script>
