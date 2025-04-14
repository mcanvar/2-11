<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 relative">
    <!-- Language Switcher -->
    <div class="absolute top-2 right-4 z-30">
      <select :value="locale" 
      @change="setLocale($event.target.value)"
      class="rounded px-2 py-1 bg-white border border-gray-300">
        <option v-for="l in availableLocales" :key="l" :value="l">
          {{ l.toUpperCase() }}
        </option>
      </select>
    </div>
    <div class="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl flex flex-col items-center">
      <h1 class="text-4xl font-extrabold text-orange-600 mb-2 tracking-tight">{{ t('title') }}</h1>
      <div class="mb-4 flex items-center justify-between w-full">
        <span class="text-lg font-semibold">{{ t('score') }}: </span>
        <span class="text-xl font-bold text-orange-700">{{ score }}</span>
        <button @click="restart" class="ml-auto px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded transition">{{ t('restart') }}</button>
      </div>
      <div class="bg-orange-100 rounded-lg p-2 mb-4">
        <div class="grid grid-cols-4 gap-2">
          <Cell v-for="(cell, i) in flatBoard" :key="i" :cell="cell" />
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <MoveButton v-for="dir in dirs" :key="dir.key" :dir="dir" @move="move" />
      </div>
      <GameOverlay
        :show="gameOver || gameWon"
        :message="gameOver ? t('gameOver') : t('youWin')"
        :showRestart="true"
        :type="gameWon ? 'win' : 'gameover'"
        @restart="restart"
      />
    </div>
    <p class="mt-8 text-gray-500">{{ $t('builtWith') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// @ts-ignore
const { t, locale, availableLocales, setLocale } = useI18n()

const size = 4
const board = ref<number[][]>([])
const score = ref(0)
const gameOver = ref(false)
const gameWon = ref(false)

const dirs = [
  { key: 'up', icon: '⬆️' },
  { key: 'left', icon: '⬅️' },
  { key: 'down', icon: '⬇️' },
  { key: 'right', icon: '➡️' },
]

function getEmptyCells(b: number[][]) {
  const cells: [number, number][] = []
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (b[i][j] === 0) cells.push([i, j])
    }
  }
  return cells
}

function addRandomTile() {
  const empty = getEmptyCells(board.value)
  if (empty.length === 0) return
  const [i, j] = empty[Math.floor(Math.random() * empty.length)]
  board.value[i][j] = Math.random() < 0.9 ? 2 : 4
}

function initBoard() {
  board.value = Array.from({ length: size }, () => Array(size).fill(0))
  addRandomTile()
  addRandomTile()
  score.value = 0
  gameOver.value = false
  gameWon.value = false
}

function transpose(b: number[][]) {
  return b[0].map((_, i) => b.map(row => row[i]))
}

function slide(row: number[]) {
  let arr = row.filter(v => v)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2
      score.value += arr[i]
      arr[i + 1] = 0
      if (arr[i] === 2048) gameWon.value = true
    }
  }
  arr = arr.filter(v => v)
  while (arr.length < size) arr.push(0)
  return arr
}

function move(dir: 'up' | 'down' | 'left' | 'right') {
  if (gameOver.value || gameWon.value) return
  let oldBoard = board.value.map(row => [...row])
  if (dir === 'left') {
    board.value = board.value.map(slide)
  } else if (dir === 'right') {
    board.value = board.value.map(row => slide([...row].reverse()).reverse())
  } else if (dir === 'up') {
    let t = transpose(board.value).map(slide)
    board.value = transpose(t)
  } else if (dir === 'down') {
    let t = transpose(board.value).map(row => slide([...row].reverse()).reverse())
    board.value = transpose(t)
  }
  if (JSON.stringify(oldBoard) !== JSON.stringify(board.value)) {
    addRandomTile()
    if (!canMove()) gameOver.value = true
  }
}

function canMove() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board.value[i][j] === 0) return true
      if (i < size - 1 && board.value[i][j] === board.value[i + 1][j]) return true
      if (j < size - 1 && board.value[i][j] === board.value[i][j + 1]) return true
    }
  }
  return false
}

function restart() {
  initBoard()
}

const flatBoard = computed(() => board.value.flat())

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

onMounted(() => {
  initBoard()
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up')
    else if (e.key === 'ArrowDown') move('down')
    else if (e.key === 'ArrowLeft') move('left')
    else if (e.key === 'ArrowRight') move('right')
  })
})
</script>

