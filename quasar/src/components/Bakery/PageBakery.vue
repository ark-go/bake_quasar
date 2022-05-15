<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <bakery></bakery>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Bakery from "components/Bakery/Bakery.vue";

export default defineComponent({
  name: "PageSprav",
  components: {
    Bakery,
  },
});
</script>
