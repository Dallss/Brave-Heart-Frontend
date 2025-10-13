<template>
  <base-section class="how-to-use-section" height="fit-content">
    <h2 class="how-to-use-title">How to Use a Fire Extinguisher</h2>
    <div class="how-to-use-content">
      <div class="video-container">
        <iframe
          class="video"
          src="https://www.youtube.com/embed/cv7yPN2KjOs"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <div class="how-to-use-text">
        <p class="how-to-use-note">
          Tip: Remember the <strong class="red">PASS</strong> technique!
        </p>
        <ol class="how-to-use-steps">
          <li><strong class="red">P</strong> - Pull the pin to break the tamper seal.</li>
          <li><strong class="red">A</strong> - Aim the nozzle at the base of the fire.</li>
          <li>
            <strong class="red">S</strong> - Squeeze the handle to release the extinguishing agent.
          </li>
          <li><strong class="red">S</strong> - Sweep from side to side until the fire is out.</li>
        </ol>
      </div>
    </div>
  </base-section>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
</script>

<style scoped>
.how-to-use-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: left;
  width: 100vw;
  padding: 200px 6vw;
}

.how-to-use-title {
  font-size: clamp(1rem, 2vw + 0.5rem, 2.5rem);
  font-weight: 600;
  color: black;
  margin-bottom: 1.5rem;
  align-self: flex-start;
}

.video-container {
  position: relative;
  width: 80%;
  max-width: 560px;
  aspect-ratio: 16 / 9;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.how-to-use-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 2rem;
  justify-content: center;
}

.how-to-use-text {
  width: auto;
  background-color: rgba(251, 255, 149, 0.287);
  padding: 10px 30px;
  border: 3px solid rgba(232, 232, 0, 0.706);
  border-radius: 25px;
}

.how-to-use-note {
  font-style: italic;
  font-size: clamp(0.4rem, 1vw + 0.2rem, 1.2rem);
  color: #555;
  margin-bottom: 1rem;
}

.how-to-use-steps {
  list-style: none;
  padding: 0;
  font-size: clamp(0.4rem, 1vw + 0.2rem, 1.2rem);
  line-height: 1.6;
}

.how-to-use-steps li {
  margin-bottom: 0.5rem;
}

.red {
  color: rgb(122, 0, 0);
  font-weight: 700;
}

/* Make layout stack nicely on small screens */
@media (max-width: 700px) {
  .how-to-use-section {
    padding: 100px 5vw;
  }

  .video-container {
    width: 100%;
    max-width: none;
  }

  .how-to-use-text {
    width: 100%;
    padding: 15px 25px;
  }
}
</style>
