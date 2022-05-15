<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <select-date-ext></select-date-ext>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import SelectDateExt from "components/select/SelectDateExt.vue";
import Partners from "components/Partners.vue";
export default defineComponent({
  name: "PageProdaja",
  components: {
    SelectDateExt,
  },
});
</script>
