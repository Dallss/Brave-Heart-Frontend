<template>
  <base-section class="title-page" height="fit-content">

    <div class="left page-part">
      <div class="nav">
        <div class="link">
          <a href="#shop">Shop</a>
          <span>|</span>
          <a href="#how-to-use">How to use</a>
          <span>|</span>
          <a href="#faq">FAQ</a>
          <span>|</span>
          <a href="#about-us">About Us</a>
        </div>
      </div>
      <div class="page-header">
        <div class="company-intro">
          <img src="@/assets/logo-naked.png" alt="Brave Heart logo" class="logo">
          <div class="title">
            <h1 class="main-title">{{ company.name }}</h1>
            <p class="subtitle">{{ company.slogan }}</p>
          </div>
        </div>
        <div class="contact-info">
          <p class="contact-header">Contact Us</p>
          <p class="contact-phone">123-456-7890</p>
          <p class="contact-email">info@alexanderextinguisher.com</p>
        </div>
      </div>
    </div>

    <div class="right page-part">
      <div class="type-select-content">
        <div :key="normalizedTypes.join('-')" ref="sliderRef" class="keen-slider">
          <div class="keen-slider__slide" v-for="(type, index) in normalizedTypes" :key="index">
            <img
              class="extinguisher-image"
              :src="getExtinguisherImage(type)"
              :alt="`Extinguisher ${type}`"
            />
          </div>
        </div>

        <div v-if="normalizedTypes.length >= 1" class="slider-controls">
          <button class="nav-button" @click="prevSlide">
            <icon-lucide-chevron-left class="arrow-icon" />
          </button>

          <div class="selected-class-indicator">
            Class: {{ normalizedTypes[currentSlide] }}
          </div>

          <!-- Add text of type here [A,B,etc]-->
          <button class="nav-button" @click="nextSlide">
            <icon-lucide-chevron-right class="arrow-icon" />
          </button>
        </div>
      </div>

      <div class="type-selector-container">
        <h2 class="type-selector-title">Select your use case</h2>
        <h4>
          Suggested Extinguisher Class:
          <strong>{{ extinguisherType.join(', ') }}</strong>
        </h4>
        <TypeSelector class="type-selector" v-model:selected="extinguisherType" />
      </div>
    </div>

  </base-section>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import KeenSlider from 'keen-slider'
import BaseSection from './BaseSection.vue'
import TypeSelector from '../components/TypeSelector.vue'

const extinguisherType = ref(['A', 'B', 'C'])
const sliderRef = ref(null)
let sliderInstance = null
let currentSlide = ref(0)

const normalizedTypes = computed(() =>
  Array.isArray(extinguisherType.value) ? extinguisherType.value : [extinguisherType.value],
)

import imgA from '@/assets/fire-extinguisher/A.png'
import imgB from '@/assets/fire-extinguisher/B.png'
import imgC from '@/assets/fire-extinguisher/C.png'
import imgD from '@/assets/fire-extinguisher/D.png'
import imgK from '@/assets/fire-extinguisher/K.png'

const company = {
  name: 'Brave Heart',
  slogan: 'Protecting lives, one extinguisher at a time',
}

const imageMap = {
  A: imgA,
  B: imgB,
  C: imgC,
  D: imgD,
  K: imgK,
}

const getExtinguisherImage = (type) => {
  return imageMap[type] || imgA
}

const initSlider = () => {
  if (sliderInstance) {
    sliderInstance.destroy()
  }
  if (sliderRef.value && normalizedTypes.value.length > 0) {
    sliderInstance = new KeenSlider(sliderRef.value, {
      loop: true,
      slides: { perView: 1 },
      slideChanged(s) {
        currentSlide.value = s.track.details.rel
      },
    })
  }
}

watch(normalizedTypes, async () => {
  await nextTick()
  initSlider()
})

onMounted(() => {
  initSlider()
})

const prevSlide = () => {
  sliderInstance?.prev()
}
const nextSlide = () => {
  sliderInstance?.next()
}
</script>

<style scoped>
@import 'keen-slider/keen-slider.min.css';

.title-page {
  display: flex;
  background-color: #fff;
  padding: 0;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
}
.page-part {
  height: 80vh;
  width: 100%;
  flex: 1;
  position: relative;
  min-width: 550px;
}
/* Disable min-width on mobile */
@media (max-width: 550px) {
  .page-part {
    min-width: 100%; /* or simply remove the restriction */
  }
  .left {
    height: 90vh;  /*  Reduce height of ehader on mobileview */
  }

}
.left {
  display: flex;
  justify-content: center;
  background-color: #420707;
  color: white;
}
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 700px;
  /* background-color: #c6c6c6; */
}

/*
TODO: remove this and make component work
Context: This removes .rigth for viewports under 700 (such as mobile) due to css issues.
*/
@media (max-width: 700px) {
  .right {
    display: none;
  }
}
.page-header {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 80%;
  align-items: center;
  justify-content: center;
}
.logo {
  width: 150px;
  aspect-ratio: 1/1;
  object-fit: contain;
}
.company-intro {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  flex-wrap: wrap;
}
.nav {
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px;
  height: fit-content;
  margin: 0;
}

.link a {
  display: flex;
  align-items: center;
  font-weight: 150;
  font-size: clamp(0.2rem, 0.6rem + 0.5vw, 0.9rem);
}

.title {
  height: fit-content;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 90%;
}
.main-title {
  font-size: clamp(2.5rem, 5vw + 1rem, 3.5rem);
  font-weight: 600;
  line-height: 1.2;
}
.subtitle {
  font-size: clamp(1rem, 1.2vw + 0.5rem, 1.2rem);
  font-weight: 200;
  font-style: italic;
}
.contact-info {
  justify-content: center;
  margin-top: auto;
  margin-bottom: 4rem;
}
.contact-header,
.contact-phone,
.contact-email {
  font-size: clamp(0.5rem, 0.5rem + 0.8vw, 0.8rem);
  text-align: center;
  margin-bottom: 10px;
  color: #dadada;
}
.contact-header {
  font-weight: 600;
  font-size: clamp(0.6rem, 0.6rem + 1vw, 1rem);
  margin-top: 0;
}
.type-select-content {
  position: relative;
  width: 100%;
  height: fit-content;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.keen-slider {
  width: 100%;
  height: fit-content;
  overflow: hidden;
}
.keen-slider__slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.extinguisher-image {
  width: 70%;
  aspect-ratio: 2/3;
  max-width: 100%;
  object-fit: contain;
  box-sizing: border-box;
  margin: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border: 0.2px solid rgba(0, 0, 0, 0.243);
}
.slider-controls {
  position: absolute;
  bottom: -5rem;
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateY(-50%);
  padding: 0 1rem;
}
.selected-class-indicator {
  padding: 0.8rem;
  background-color: #ffffff; /* dirty/off-white */
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); soft floating effect */
  border: 0.1px solid rgba(0, 0, 0, 0.329);

  font-weight: 600;
  font-size: 1.1rem;
}
.nav-button {
  background-color: rgba(255, 255, 255, 0);
  color: #ffffff;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 1.8rem;        /* fixed width */
  height: 1.8rem;       /* fixed height, same as width */
  border-radius: 50%; /* makes it a circle */
  display: flex;       /* center the content */
  align-items: center; /* center vertically */
  justify-content: center; /* center horizontally */
  user-select: none;
  transition: background 0.2s ease;
  background-color: rgb(220, 220, 220);
}

.nav-button:hover {
  background-color: rgba(200, 200, 200, 0.9);
}

.type-selector-container {
  width: 50%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem;
}
.type-selector-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
}
.type-selector {
  margin-top: 20px;
}
</style>
