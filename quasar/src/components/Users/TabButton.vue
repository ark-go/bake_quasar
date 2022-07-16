<template>
  <q-tabs
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
    mobile-arrows
    inline-label
  >
    <q-tab name="main" label="Выбор" />
    <q-tab name="usersAll" label="Все" :disable="disable" />
    <q-tab v-for="tab in buttonArray" :key="tab.name" v-bind="tab" />
  </q-tabs>
  <q-separator />
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import { useUsersPanelStore } from "stores/usersPanelStore.js";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabButton",
  components: {},
  props: {
    buttonArray: {
      type: Array,
      default: () => [],
    },
    tabModel: String,
  },
  emits: ["update:tabModel"],
  setup(props, { emit }) {
    const usersPanelStore = useUsersPanelStore();
    const disable = ref(false);
    watchEffect(() => {
      disable.value =
        usersPanelStore.treeRow?.rgt - usersPanelStore.treeRow?.lft != 1;
      if (disable.value) {
        emit("update:tabModel", "main");
      }
    });

    return { usersPanelStore, disable };
  },
});
</script>
