<template>
  <ark-card
    :title="'Составление рецепта' + ttkNumberStr"
    :subTitle="curentRowName"
    style="width: 700px"
    :heightRabZone="heightRabZone"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Получить PDF' }"
    @menuClick="menuClick"
    @onBodyResize="onBodyResize"
  >
    <template v-slot:leftTop>
      <button-down
        @on-change-razdel="onChangeRazdel"
        :label="labelButtonDown"
      ></button-down>
    </template>
    <template v-slot:leftCenter>
      <table-raw
        :tabname="currentTableName"
        @add-ingredient="addIngredient"
        :ref="(el) => (refTable = el)"
      ></table-raw>
    </template>
    <template v-slot:rightTop>
      <button-down
        :disable-main-btn="true"
        @on-change-razdel="onChangeRazdel"
        label="Ингредиенты"
      ></button-down>
    </template>
    <template v-slot:rightCenter>
      <table-ingred
        :tabname="currentTableName"
        :isLeft="true"
        :ref="(el) => (refTableIngred = el)"
      ></table-ingred>
    </template>
  </ark-card>
</template>

<script>
import {
  defineComponent,
  onMounted,
  defineAsyncComponent,
  ref,
  watchEffect,
} from "vue";
import ArkCard from "./ArkCard.vue";
import { arkVuex } from "src/utils/arkVuex.js";
import { dom } from "quasar";
//import FormSelectIngr from "./FormSelectIngr.vue";
import ButtonDown from "./ButtonDown.vue";
import TableRaw from "./TableRaw.vue";
import TableIngred from "./TableIngred.vue";
export default defineComponent({
  name: "p-recept",
  props: ["heightRabZone"],
  components: { ArkCard, TableRaw, TableIngred, ButtonDown },
  emits: ["onToMain"],
  setup(props, { emit }) {
    const { height } = dom;
    const { selectedRowsVuex } = arkVuex();
    const currentRow = ref({});
    const curentRowName = ref("");
    const ttkNumberStr = ref("");
    const currentTableName = ref("productraw"); // products
    const labelButtonDown = ref("");
    const topElement = ref({});
    const refTable = ref(null);
    const refTableIngred = ref(null);
    async function onChangeRazdel(val) {
      currentTableName.value = val;

      switch (val) {
        case "products":
          labelButtonDown.value = "Раздел продукции";
          await refTable.value.loadTable("loadProducts", "recept");
          break;
        case "productraw":
          labelButtonDown.value = "Раздел сырья";
          await refTable.value.loadTable("loadRaw", "recept");
          break;
        default:
          break;
      }
    }
    async function addIngredient() {
      await refTableIngred.value.loadTable(); // перечитаем что там по умолчанию
      // при обновлении ингредиентов.. обновляем продукты, если у  нас таблица продуктов активна
      // там могла поменятся сумма
      if (currentTableName.value == "products") {
        await refTable.value.loadTable("loadProducts", "recept");
      }
    }
    onMounted(() => {
      onChangeRazdel("productraw");
    });
    watchEffect(() => {
      if (selectedRowsVuex.products.length == 1) {
        currentRow.value = selectedRowsVuex.products[0];
        curentRowName.value =
          currentRow.value.productvid_name + ", " + currentRow.value.name;
        ttkNumberStr.value = " ТТК№ " + currentRow.value.document_num;
      } else {
        currentRow.value = null;
        ttkNumberStr.value = "";
      }
    });

    function onBtnToogle(val) {
      console.log("Выбор: ", val);
    }
    const buttonArr = ref([
      { key: "back", name: "Обратно" },
      //  { key: "Добавить", name: "Второй" },
    ]);
    function buttonClick(val) {
      if (val == "back") {
        emit("onToMain");
      }
    }
    return {
      buttonArr,
      buttonClick,
      addIngredient,
      currentRow,
      curentRowName,
      ttkNumberStr,
      onBtnToogle,
      labelButtonDown,
      onChangeRazdel,
      currentTableName,
      topElement,
      refTable,
      refTableIngred,
      onBodyResize(val) {},
    };
  },
});
</script>
<style lang="scss" scoped>
//
.comp-fade-enter-active,
.comp-fade-leave-active {
  transition: opacity 0.3s ease;
}

.comp-fade-enter-from,
.comp-fade-leave-to {
  opacity: 0;
}
</style>
