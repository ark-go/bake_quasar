<template>
  <q-menu auto-close touch-position context-menu>
    <q-list>
      <q-item clickable @click="menuAddToGroup">
        <q-item-section no-wrap>
          <q-item-label lines="1">Добавить в группу</q-item-label>
          <q-item-label caption lines="2">{{ currentGroupName }}</q-item-label>
        </q-item-section>
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
    dataSlot: Object, //row
    currentGroupName: {
      type: String,
      default: "",
    },
  },
  emits: ["menuAddToGroup"],
  setup(props, { emit }) {
    const rows = ref([]);
    function menuAddToGroup() {
      emit("menuAddToGroup", props.dataSlot?.row);
    }
    return {
      menuAddToGroup,
    };
  },
});
</script>
