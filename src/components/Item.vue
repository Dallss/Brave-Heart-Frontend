<template>
  <div class="item" @click="handleClick">
    <div class="image-container">
      <img :src="item.image" :alt="item.name" />
    </div>

    <div class="details">
      <p class="class">{{ item.class }}</p>
      <p class="name">{{ item.name }}</p>

      <p
        class="stock"
        :class="item.stock !== 0 ? 'stock-available' : 'stock-out'"
      >
        {{ item.stock !== 0 ? `In-stock: ${item.stock}` : 'Out of Stock' }}
      </p>

      <p class="price">₱ {{ item.range }}</p>
    </div>
  </div>
</template>

<script setup>
import { toRefs, defineOptions, defineEmits } from 'vue'

defineOptions({ name: 'ShopItem' })

const emit = defineEmits(['show-details'])

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const { item } = toRefs(props)

function handleClick() {
  emit('show-details', item.value)
}
</script>

<style scoped>
/* CARD — 3:5 Aspect Ratio */
.item {
  width: 100%;
  aspect-ratio: 2 / 3; /* 🔥 KEY PART */
  background-color: rgba(184, 184, 184, 0.06);
  color: black;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.18);
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 6px;

  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.item:hover {
  transform: translateY(-2px);
}

.item:active {
  transform: scale(0.98);
}

/* IMAGE (takes top space proportionally) */
.image-container {
  width: 100%;
  flex: 0 0 58%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* DETAILS (rest of card) */
.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3px;
}

/* TEXT */
.class,
.stock {
  font-family: Montserrat, sans-serif;
  margin: 0;
}

.class {
  font-size: clamp(11px, 1.8vw, 13px);
  opacity: 0.8;
}

.name {
  font-size: clamp(13px, 2.2vw, 16px);
  font-weight: 500;
  line-height: 1.2;
}

.stock {
  font-size: clamp(11px, 1.8vw, 13px);
  font-weight: 600;
}

.price {
  margin-top: auto;
  font-size: clamp(14px, 2.3vw, 16px);
  font-weight: 400;
  color: #008000;
}

/* STOCK COLORS */
.stock-available {
  color: rgba(0, 0, 0, 0.493);
}

.stock-out {
  color: #d32f2f;
}
</style>
