<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <convert-CSV></convert-CSV>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import ConvertCSV from "components/ConvertCSV.vue";
export default defineComponent({
  name: "PageConvertCSV",
  components: {
    ConvertCSV,
  },
});
</script>
