<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-expansion-item
      dense-toggle
      v-model="territoryExpand"
      :label="spravStore.selectedRow.name"
      caption="печник Алина"
      header-style="padding-right:1px"
    >
      <!-- <template v-slot:header>
        <span class="text-weight-bold" style="width: 100%">{{
          spravStore.selectedRow.name
        }}</span>
      </template> -->
      <q-card>
        <q-card-section>
          Это группа печек, собрана в честь самого лучшего повара на земле, эти
          печки отбирал он сам лично, в них пекутся самые лучшие лепешки. В этой
          группе регион не будет совпадать с тем что указан в печке, потому что
          в печке он указан по другому
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-item>
      <q-item-section>
        <Tabs-Tables
          :activeTab="activeTab"
          @update:activeTab="$emit('update:activeTab', $event)"
        ></Tabs-Tables>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useSpravStore } from "stores/spravStore";
import TabsTables from "./TabsTables.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "ButtonsPanel",
  components: { TabsTables },
  props: ["refTable", "activeTab"],
  emits: ["update:filter"],
  setup(props) {
    const spravStore = useSpravStore();
    console.log("Выбрана строка", spravStore.selectedRow);
    return {
      spravStore,
      territoryExpand: ref(false),
    };
  },
});
</script>
