<template>
  <q-page class="flex flex-center">
    <nomenclature></nomenclature>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Nomenclature from "components/Nomenclature.vue";

export default defineComponent({
  name: "PageTabNomenclature",
  components: {
    Nomenclature,
  },
});
</script>
