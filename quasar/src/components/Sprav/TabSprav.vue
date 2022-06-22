<template>
  <div :ref="(el) => (refTabsButton = el)">
    <q-tabs
      v-model="tabModel"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="treeTab" label="Выбор" />
      <q-tab name="treeTable" label="Список" />
    </q-tabs>

    <q-separator />
  </div>
  <q-tab-panels v-model="tabModel" animated keep-alive>
    <q-tab-panel
      name="treeTab"
      style="padding: 0"
      :style="{ maxHeight: maxSubBodyHeight, overflow: 'auto' }"
    >
      <slot name="before"></slot>
    </q-tab-panel>

    <q-tab-panel
      name="treeTable"
      style="padding: 0"
      :style="{ maxHeight: maxSubBodyHeight, overflow: 'auto' }"
    >
      <slot name="after"></slot>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent, ref, computed, watchEffect, watch } from "vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabSprav",
  props: {
    maxBodyHeight: String,
    selectedNode: Object,
  },
  components: {},
  setup(props) {
    const refTabsButton = ref();
    const maxSubBodyHeight = ref("");
    const tabModel = ref("treeTab");
    watch(
      () => props.selectedNode.key,
      () => {
        if (props.selectedNode.tableName) tabModel.value = "treeTable";
      }
    );
    watchEffect(() => {
      maxSubBodyHeight.value = `calc(${props.maxBodyHeight} - ${refTabsButton.value?.offsetHeight}px)`;
      console.log("panels height+++", maxSubBodyHeight.value);
    });
    return {
      tabModel,
      refTabsButton,
      maxSubBodyHeight,
    };
  },
});
</script>
