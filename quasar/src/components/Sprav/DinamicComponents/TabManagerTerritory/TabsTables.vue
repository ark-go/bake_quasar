<template>
  <q-tabs
    :model-value="activeTab"
    @update:model-value="$emit('update:activeTab', $event)"
    vertical
    align="left"
    inline-label
    outside-arrows
    mobile-arrows
    active-bg-color="blue-3"
    class="text-primary"
  >
    <q-tab
      name="groupBakery"
      icon="event"
      label="Управляет территориями"
      style="justify-content: left"
    />
    <q-tab
      name="freeBakery"
      icon="event_available"
      label="Свободные территории"
      style="justify-content: left"
    />
    <q-tab
      name="busyBakery"
      icon="event_busy"
      label="Чужие территории"
      style="justify-content: left"
    />
    <q-tab
      name="allBakery"
      icon="event_note"
      label="Все территории"
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
