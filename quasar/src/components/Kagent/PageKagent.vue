<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <kagent></kagent>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Kagent from "components/Kagent/Kagent.vue";

export default defineComponent({
  name: "PageSprav",
  components: {
    Kagent,
  },
});
</script>
