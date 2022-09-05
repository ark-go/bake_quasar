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
    <q-item>
      <q-item-section>
        <field-select-territory
          :sprav="territoryRows"
          label="Территория"
          :selectId="territoryId"
          @update:selectId="$emit('update:territoryId', $event)"
        ></field-select-territory>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <Field-Select
          :sprav="bakeryRows"
          label="Пекарня"
          v-model:selectId="selectBakeryId"
        ></Field-Select>
      </q-item-section>
    </q-item>
    <q-item @click="$emit('onGetExcel')" clickable v-ripple>
      <q-item-section side top>
        <q-icon name="print" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Вывод в Excel</q-item-label>
        <q-item-label caption
          >Экспорт данных из выбранного диапазона дат, без учета торговой сети и
          пекарни</q-item-label
        >
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import FieldSelect from "./FieldSelect.vue";
import FieldSelectTerritory from "./FieldSelectTerrytory.vue";
import SelectDateExt from "./SelectDateExt.vue";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: { FieldSelect, SelectDateExt, FieldSelectTerritory },
  props: ["refTable", "activeTab", "trademarkId", "territoryId"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    const {
      bakerySelectedRow,
      trademarkRows,
      selectedDateBetweenBakery,
      territoryRows,
      bakeryRows,
    } = storeToRefs(useSaleStore());
    console.log("Выбрана строка", bakerySelectedRow.value);
    const selectBakeryId = computed({
      get: () => {
        return bakerySelectedRow.value.id;
      },
      set: (val) => {
        let bakery = bakeryRows.value.find((bakeryVal) => {
          return bakeryVal.id == val;
        });
        bakerySelectedRow.value = bakery;
      },
    });
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
      territoryRows,
      onClickEdit,
      onClickNew,
      onDelete,
      sideExpand: ref(false),
      bakeryRows,
      selectBakeryId,
    };
  },
});
</script>
