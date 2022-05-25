<template>
  <ark-card
    class="ark-scroll"
    title="Пекарни / продукция"
    subTitle="Наличие продукции в пекарнях"
    style="max-width: 1024px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Не жми' }"
    @menuClick="menuClick"
  >
  </ark-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import ArkCard from "components/Card/ArkCard.vue";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "f-bakery",
  components: {
    ArkCard,
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
