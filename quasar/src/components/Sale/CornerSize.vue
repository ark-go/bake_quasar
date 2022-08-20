<template>
  <div ref="corner" class="corner" v-touch-pan.prevent.mouse="moveFab"></div>
</template>
<script>
// не доделано работает только по X , и только при авто центрировании формы
import { defineComponent, ref, onMounted } from "vue";
export default defineComponent({
  props: {
    sizeX: Number,
    sizeY: Number,
    onlyX: {
      type: Boolean,
      default: false,
    },
    onlyY: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const corner = ref(null);
    const buffX = ref(0);
    const buffY = ref(0);
    return {
      corner,
      moveFab(ev) {
        if (!corner.value) return;

        // let parentWidth = corner.value.offsetWidth; // ширина нашего корненра
        if (!props.onlyY) {
          if (ev.isFirst) {
            buffX.value = props.sizeX; // родитель
          }
          //          console.log(">>>>", ev.position.left, props.sizeX, buffX.value, ev);
          emit("update:sizeX", buffX.value + ev.offset.x * 2); // *2 потому что центрируем форму
        }
        if (!props.onlyX) {
          if (ev.isFirst) {
            buffY.value = props.sizeY; // родитель
          }
          emit("update:sizeX", buffX.value + ev.offset.x * 2); // без центровки плохо
        }
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.corner {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  border: 10px solid transparent;
  border-right: 10px solid #eaf8f8;
  border-bottom: 10px solid #eaf8f8;
  display: block;
  width: 0;
  height: 0;
  cursor: nwse-resize;
}
</style>
