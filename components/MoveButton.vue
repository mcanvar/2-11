<template>
  <button
    @click="$emit('move', dir.key)"
    class="px-3 py-2 bg-gray-200 hover:bg-gray-400 rounded text-xl shadow"
  >
    {{ dir.icon }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ dir: { key: 'up' | 'down' | 'left' | 'right', icon: string } }>()
</script>
