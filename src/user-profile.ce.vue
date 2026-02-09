<template>
  <div class="rounded-xl border border-slate-200 p-4 shadow-sm bg-red-400">
    <p class="text-xs uppercase tracking-wide text-slate-500">User Profile</p>
    <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ name }}</h3>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: 'Anonymous'
  }
})
</script>

<style>
@import "tailwindcss";
</style>
