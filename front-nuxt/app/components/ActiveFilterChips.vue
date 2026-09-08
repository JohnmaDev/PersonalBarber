<template>
  <Transition name="fade">
    <div v-if="chips.length > 0" class="flex flex-wrap items-center gap-2 mb-6">
      <span class="text-[11px] font-black uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1.5">
        <fa-icon :icon="['fas', 'sliders-h']" class="text-[10px] dept-text" />
        <span>Filtros activos:</span>
      </span>

      <!-- Chips individuales -->
      <TransitionGroup name="chip-list">
        <button
          v-for="chip in chips"
          :key="chip.id"
          @click="$emit('remove', chip)"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 border border-zinc-700 hover:border-red-500/50 hover:bg-red-500/10 text-white hover:text-red-300 transition-all duration-200 group shadow-sm"
          :title="`Remover filtro: ${chip.label}`"
        >
          <span>{{ chip.label }}</span>
          <fa-icon :icon="['fas', 'times']" class="text-[10px] text-zinc-400 group-hover:text-red-400 transition-colors" />
        </button>
      </TransitionGroup>

      <!-- Botón Limpiar Todos -->
      <button
        @click="$emit('clear-all')"
        class="text-xs font-black text-red-400 hover:text-red-300 hover:underline px-2 py-1 transition-colors uppercase tracking-wider ml-auto sm:ml-2 flex items-center gap-1"
      >
        <fa-icon :icon="['fas', 'trash-alt']" class="text-[10px]" />
        <span>Limpiar todo</span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ActiveChip } from '~/composables/useProductFilters'

defineProps<{
  chips: ActiveChip[]
}>()

defineEmits<{
  (e: 'remove', chip: ActiveChip): void
  (e: 'clear-all'): void
}>()
</script>

<style scoped>
.chip-list-enter-active,
.chip-list-leave-active {
  transition: all 0.25s ease;
}
.chip-list-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.chip-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
