<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-item>
      <q-item-section>
        <Field-Select
          :sprav="bakeryRows"
          label="Пекарня"
          v-model:selectId="selectBakeryId"
        ></Field-Select>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section avatar>
        <q-checkbox
          :model-value="checkDateSale"
          @update:model-value="onCheckDateSale"
          checked-icon="star"
          unchecked-icon="star_border"
          indeterminate-icon="help"
          dense
        />
      </q-item-section>
      <q-item-section>
        <Select-Date-Ext></Select-Date-Ext>
      </q-item-section>
    </q-item>
    <q-item v-if="checkDateSale">
      <q-item-section>
        <Form-Select-Card></Form-Select-Card>
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="showHiddenArticle = !showHiddenArticle">
      <q-item-section avatar>
        <q-icon name="playlist_add" />
      </q-item-section>
      <q-item-section>
        {{
          showHiddenArticle
            ? "Убрать скрытые артикулы"
            : "Показать скрытые артикулы"
        }}
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import FieldSelect from "./FieldSelect.vue";
import SelectDateExt from "./SelectDateExt.vue";
import FormSelectCard from "./FormSelectCard.vue";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: { FieldSelect, SelectDateExt, FormSelectCard },
  props: ["refTable", "activeTab", "trademarkId"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    const saleStore = useSaleStore();
    const {
      bakerySelectedRow,
      bakeryRows,
      showHiddenArticle,
      checkDateSale,
      selectedArticleBakeryRow,
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
    function onCheckDateSale(val) {
      saleStore.debonceArticle(() => {
        checkDateSale.value = val;
      });
    }
    function onClickEdit() {
      emit("onClickEdit");
    }
    function onClickNew() {
      // emit("onClickNew");
    }
    function onDelete() {
      emit("onDelete");
    }
    return {
      bakeryRows,
      bakerySelectedRow,
      onClickEdit,
      onClickNew,
      onDelete,
      sideExpand: ref(false),
      selectBakeryId,
      showHiddenArticle,
      selectedArticleBakeryRow,
      checkDateSale,
      onCheckDateSale,
    };
  },
});
</script>
