<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <catalogs></catalogs>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Catalogs from "components/Catalogs.vue";

export default defineComponent({
  name: "PageTabCatalogs",
  components: {
    Catalogs,
  },
});
</script>
