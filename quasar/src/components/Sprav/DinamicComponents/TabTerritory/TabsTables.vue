<template>
  <q-tabs
    :model-value="activeTab"
    @update:model-value="$emit('update:activeTab', $event)"
    vertical
    align="left"
    inline-label
    outside-arrows
    mobile-arrows
    active-bg-color="info"
    class="text-primary"
  >
    <q-tab
      name="groupBakery"
      icon="mail"
      label="раз"
      style="justify-content: left"
    />
    <q-tab
      name="freeBakery"
      icon="alarm"
      label="два"
      style="justify-content: left"
    />
    <q-tab
      name="allOtherBakery"
      icon="movie"
      label="три"
      style="justify-content: left"
    />
  </q-tabs>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "FormAdd",
  components: {},
  props: ["activeTab"],
  emits: [],
  setup(props) {
    return {};
  },
});
</script>
