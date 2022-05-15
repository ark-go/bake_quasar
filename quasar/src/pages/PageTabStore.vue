<template>
  <q-page class="flex column flex-center">
    <select-store></select-store>
    <store></store>
    <spec-doc-store></spec-doc-store>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Store from "components/Store.vue";
import SpecDocStore from "components/Spec/SpecDocStore.vue";
import SelectStore from "components/select/SelectStore.vue";

export default defineComponent({
  name: "PageTabPartners",
  components: {
    Store,
    SpecDocStore,
    SelectStore,
  },
});
</script>
