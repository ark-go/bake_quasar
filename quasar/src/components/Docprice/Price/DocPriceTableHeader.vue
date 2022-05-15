<template v-slot:header="props">
  <q-tr :props="props">
    <q-th></q-th>
    <q-th
      v-for="col in props.cols"
      :key="col.name"
      :props="props"
      class="text-italic text-blue"
    >
      {{ col.label }}
    </q-th>
  </q-tr>
</template>

<script>
import { ref, watch } from "vue";
import { useDocPrice } from "stores/storeDocPrice.js";
export default {
  name: "DocPriceTableHeader",
  props: {
    props: Object,
  },
  setup() {
    return {};
  },
};
</script>
