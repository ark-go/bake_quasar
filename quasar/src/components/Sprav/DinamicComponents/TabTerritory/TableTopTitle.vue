<template>
  <q-field dense class="full-width">
    <template v-slot:control>
      <div class="self-center full-width no-outline">
        {{ title }}
      </div>
    </template>
    <template v-slot:append>
      <q-checkbox
        :model-value="extendPanel"
        @update:model-value="$emit('update:extendPanel', $event)"
        checked-icon="star"
        unchecked-icon="star_border"
        indeterminate-icon="help"
      />
    </template>
  </q-field>
</template>

<script>
import { defineComponent, ref } from "vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TableTopFind",
  components: {},
  props: ["title", "extendPanel"],
  emits: ["update:filter", "update:extendPanel"],
  setup(props) {
    return {};
  },
});
</script>
