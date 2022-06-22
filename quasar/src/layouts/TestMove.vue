<template>
  <img
    ref="refDrag"
    alt="Тындыр"
    src="/public/images/logo.png"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
      cursor: dragging ? 'grabbing' : 'grab',
    }"
    draggable="false"
    @mousedown="dragging = true"
  />
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
export default {
  setup() {
    const refDrag = ref({});
    const $q = useQuasar();
    const dragging = ref(false);
    const mouseX = ref(0);
    const mouseY = ref(0);
    const x = ref(330);
    const y = ref(5);
    onMounted(() => {
      console.dir(refDrag.value);
      window.addEventListener("mousemove", (e) => {
        if (dragging.value) {
          const diffX = e.clientX - mouseX.value;
          const diffY = e.clientY - mouseY.value;
          x.value += diffX;
          y.value += diffY;
          if (refDrag.value.offsetLeft < 0) x.value = 0; // меньше левого
          if (refDrag.value.offsetTop < 0) y.value = 0; // меньше верха
          if (x.value + refDrag.value.offsetWidth > $q.screen.width)
            // больше экрана вправо
            x.value = $q.screen.width - refDrag.value.offsetWidth;
          if (y.value + refDrag.value.offsetHeight > $q.screen.height)
            // больше экрана вниз
            y.value = $q.screen.height - refDrag.value.offsetHeight;
        }
        mouseX.value = e.clientX;
        mouseY.value = e.clientY;
      });

      window.addEventListener("mouseup", () => {
        dragging.value = false;
      });
    });
    return {
      x,
      y,
      dragging,
      refDrag,
    };
  },
};
</script>

<style scoped>
/* .drag-container {
  width: 100vw;
  height: 100vh;
} */

img {
  cursor: grab;
  /* position: relative; */
  position: fixed;
  z-index: 2000;
}
</style>
