<template>
  <ark-card
    title="Контрагенты"
    subTitle=""
    style="width: 700px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Не жми' }"
    @menuClick="menuClick"
  >
    <kagent-table></kagent-table>
  </ark-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import KagentTable from "components/Kagent/KagentTable.vue";
import ArkCard from "components/Card/ArkCard.vue";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageKagent",
  components: {
    ArkCard,
    KagentTable,
  },
  setup() {
    //  const $q = useQuasar();
    const $router = useRouter();

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
    return {
      buttonArr,
      buttonClick,
      menuClick(val) {
        console.log("Менюшка", val);
      },
    };
  },
});
</script>
