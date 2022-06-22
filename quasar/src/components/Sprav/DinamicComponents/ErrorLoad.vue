<template>
  <div>Ашипка была при загрузке, сейчас это так задумано.</div>
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
