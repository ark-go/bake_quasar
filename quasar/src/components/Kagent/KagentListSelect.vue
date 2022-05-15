<template>
  <q-input
    dense
    :model-value="text"
    @update:model-value="$emit('update:text', $event)"
    :label="label"
    @click.stop=""
    readonly
  >
    <template v-slot:append>
      <q-btn flat round color="primary" icon="list" @click="$emit('click')" />
    </template>
  </q-input>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    label: String,
    dataValue: Object,
    text: String,
  },
  emit: ["update:text", "click"],
  setup(props) {
    return {};
  },
};
</script>
