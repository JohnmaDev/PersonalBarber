<!-- Sección para pintar los botones en el Home -->
<template>
<template>
    <button type="button" @click="$emit('click')" class="w-full focus:outline-none block text-left bg-transparent p-0 m-0 border-none">
        <div
          class="w-full border border-yellow-500 rounded-full py-3 px-6 text-center transform transition duration-200 ease-out hover:scale-105 hover:bg-yellow-500/10 cursor-pointer"
        >
          <span v-if="icon" class="mr-2 text-lg">{{ icon }}</span>
          <div class="font-bold text-white">{{ title }}</div>
          <div class="text-sm text-yellow-300">{{ priceCOP }} COP – ${{ priceUSD }} USD</div>
        </div>
  </button>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    priceCOP: String,
    priceUSD: String,
  },
}
</script>
