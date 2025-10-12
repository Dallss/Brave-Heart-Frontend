<script setup>
import HeadSection from '../sections/HeadSection.vue'
import HowToUseSection from '../sections/HowToUseSection.vue'
import FaqSection from '../sections/FaqSection.vue'
import AboutUsSection from '../sections/AboutUsSection.vue'
import ShopSection from '../sections/ShopSection.vue'
</script>

<template>
  <div class="app-wrapper">
    <!-- This is just a black header where the shopping cart button is. commented out because ther is no shopping cart button yet -->
    <!-- <div class="header">
      <router-link to="/cart" class="cart-button"></router-link>
    </div> -->
    <HeadSection />
    <ShopSection id="shop" />
    <HowToUseSection id="how-to-use" />
    <FaqSection id="faq" />
    <AboutUsSection id="about-us" />
  </div>
</template>

<style>
.app-wrapper {
  height: fit-content;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;

  background-color: black;
  font-family: 'Inter', sans-serif;

  display: flex;
  flex-direction: column;
  justify-content: center;

}

/* Maybe this has something to do with header with shopping cart. if not DELETE this */
/* body::before {
  content: '';
  position: fixed;
  top: -100px;
  left: 0;
  width: 100%;
  height: 500px;
  background-color: black;
  z-index: -1;
} */


/* .cart-button {
  height: 40%;
  aspect-ratio: 1 / 1;
  background-image: url('/shopping-cart.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: auto;
  border: none;
  background-color: transparent;
} */

.header {
  height: 55px;
  width: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
}

.nav-hover-zone {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 150px;
  z-index: 10;
}

.nav-hover-zone:hover .nav {
  height: 30px;
}

.link {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.link span {
  color: white;
  font-weight: 300;
}
</style>
