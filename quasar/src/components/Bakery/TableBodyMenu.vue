<template>
  <q-menu auto-close touch-position context-menu>
    <q-list>
      <q-item clickable @click="onClick">
        <q-item-section>Не нажимать</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Не работает</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Нихт кликен</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "FindTable",
  components: {},
  props: ["dataBody"],
  emits: ["update:dva"],
  setup(props) {
    return {
      onClick() {
        console.log("нажимал тут", props?.dataBody?.row);
        // let r = await props.dataBody.funcTable();
      },
    };
  },
});
</script>
