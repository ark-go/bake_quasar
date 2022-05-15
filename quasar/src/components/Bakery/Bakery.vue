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
    <bakery-table></bakery-table>
  </ark-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import BakeryTable from "components/Bakery/BakeryTable.vue";
import ArkCard from "components/Card/ArkCard.vue";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "f-bakery",
  components: {
    ArkCard,
    BakeryTable,
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
