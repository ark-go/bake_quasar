<template>
  <div>Ошибка при загрузке, ошибка сети или перегрузите страницу .</div>
</template>

<script>
import { defineComponent, ref } from "vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "ErrorLoad",
  components: {},
  props: ["filter"],
  emits: ["update:filter"],
  setup(props) {
    return {};
  },
});
</script>
