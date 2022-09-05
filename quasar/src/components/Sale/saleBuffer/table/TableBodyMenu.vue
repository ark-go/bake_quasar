<template>
  <q-menu auto-close touch-position context-menu>
    <q-list>
      <q-item
        v-if="menuObj.row.hidden"
        clickable
        @click="$emit('onShowArticle', menuObj)"
      >
        <q-item-section>Вернуть артикул в пекарню</q-item-section>
      </q-item>
      <q-item v-else clickable @click="$emit('onHideArticle', menuObj)">
        <q-item-section>Скрыть артикул из пекарни</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "TableBodyMenu",
  components: {},
  props: {
    menuObj: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["update:dva"],
  setup(props) {
    const rows = ref([]);
    return {};
  },
});
</script>
