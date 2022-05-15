<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <bakehouses></bakehouses>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Bakehouses from "components/Bakehouses.vue";

export default defineComponent({
  name: "PageTabBakehouses",
  components: {
    Bakehouses,
  },
});
</script>
