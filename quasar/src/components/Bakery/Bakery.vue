<template>
  <ark-card
    class="ark-scroll"
    title="Пекарни"
    subTitle=""
    style="max-width: 1024px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Не жми' }"
    @menuClick="menuClick"
  >
    <bakery-table
      @onInfoRow="onInfoRow"
      :refTable="refTable"
      :componentBodyMenu="componentBodyMenu"
      :commandLoad="{ cmd: 'load' }"
    ></bakery-table>
    <Info-Panel
      v-model:infoShow="infoShow"
      :infoData="infoData"
      :infoDataIdx="infoDataIdx"
      :infoTitle="infoTitle"
    ></Info-Panel>
  </ark-card>
</template>

<script>
import { defineComponent, ref, defineAsyncComponent } from "vue";
import BakeryTable from "components/Bakery/BakeryTable.vue";
import ArkCard from "components/Card/ArkCard.vue";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
//import InfoPanel from "./InfoPanel.vue";

export default defineComponent({
  name: "f-bakery",
  components: {
    ArkCard,
    BakeryTable,
    InfoPanel: defineAsyncComponent(() => import("./InfoPanel.vue")),
  },
  setup() {
    //  const $q = useQuasar();
    const $router = useRouter();
    const componentBodyMenu = defineAsyncComponent(() =>
      import("./TableBodyMenu.vue")
    );
    const buttonArr = ref([
      { key: "backRoute", name: "Назад" },
      //  { key: "Добавить", name: "Второй" },
    ]);
    function buttonClick(val) {
      if (val == "backRoute") {
        console.log(val);
        $router.go(-1);
      }
    }
    const infoTitle = ref("Пекарня");
    const infoShow = ref(false);
    const refTable = ref(null);
    const infoData = ref();
    const infoDataIdx = ref([]);
    function onInfoRow(row) {
      infoData.value = row;
      infoDataIdx.value = [
        { name: "Пекарня" },
        { own_kagent_name: "Собственный" },
        { territory_name: "Территория" },
        { region_name: "Регион" },
        { city_name: "Город" },
        { kolbakers: "Кол-во пекарей" },
        { address: "Адрес" },
        { description: "Доп. информация" },
      ];
      infoShow.value = true;
      console.log("show idx:", infoDataIdx.value, infoShow.value);
    }
    return {
      refTable,
      componentBodyMenu,
      infoTitle,
      infoShow,
      infoData,
      infoDataIdx,
      onInfoRow,
      buttonArr,
      buttonClick,
      menuClick(val) {
        console.log("Менюшка", val);
      },
    };
  },
});
</script>
