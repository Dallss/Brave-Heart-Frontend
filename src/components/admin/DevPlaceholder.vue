<template>
  <div class="dev-placeholder">
    <span class="dev-placeholder-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Under dev',
  },
})
</script>

<style scoped>
.dev-placeholder {
  flex: 1;
  min-height: 120px;
  border: 2px dashed #bdbdbd;
  border-radius: 6px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dev-placeholder-label {
  color: #888;
  font-size: 0.9rem;
}
</style>
