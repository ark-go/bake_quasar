<template>
  <q-input
    ref="filterRef"
    dense
    :model-value="filter"
    @update:model-value="$emit('update:filter', $event)"
    label="Поиск"
  >
    <template v-slot:append>
      <q-icon
        v-if="filter !== ''"
        name="clear"
        class="cursor-pointer"
        @click.stop="$emit('update:filter', '')"
      />
      <q-icon v-else name="search" />
    </template>
  </q-input>
</template>

<script>
import { defineComponent, ref } from "vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "FindTable",
  components: {},
  props: ["filter"],
  emits: ["update:filter"],
  setup(props) {
    return {};
  },
});
</script>
