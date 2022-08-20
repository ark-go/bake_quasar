<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-item>
      <q-item-section>
        <select-date-ext
          label="Дата"
          v-model:valueDate="selectedDateBetweenBakery"
        ></select-date-ext>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <Field-Select
          :sprav="trademarkRows"
          label="Торговая сеть"
          :selectId="trademarkId"
          @update:selectId="$emit('update:trademarkId', $event)"
        ></Field-Select>
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="onClickNew">
      <q-item-section>ку-ку-ку.</q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import FieldSelect from "./FieldSelect.vue";
import SelectDateExt from "./SelectDateExt.vue";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: { FieldSelect, SelectDateExt },
  props: ["refTable", "activeTab", "trademarkId"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    const { bakerySelectedRow, trademarkRows, selectedDateBetweenBakery } =
      storeToRefs(useSaleStore());
    console.log("Выбрана строка", bakerySelectedRow.value);
    function onClickEdit() {
      emit("onClickEdit");
    }
    function onClickNew() {
      emit("onClickNew");
    }
    function onDelete() {
      emit("onDelete");
    }
    return {
      selectedDateBetweenBakery,
      trademarkRows,
      onClickEdit,
      onClickNew,
      onDelete,
      sideExpand: ref(false),
    };
  },
});
</script>
