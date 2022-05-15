<template>
  <ark-card :title="title" :subTitle="subTitle" maxWidth="300px">
    <div class="">
      <select-date-ext label="Дата вступления"></select-date-ext>
      <select-store label="Магазин"></select-store>
      <q-input label="Артикул" dense style="width: 100%">
        <template v-slot:append>
          <q-icon name="auto_stories" />
          <q-tooltip class="bg-purple text-body2" :offset="[10, 10]">
            Артикул магазина
          </q-tooltip>
        </template>
      </q-input>
      <q-input label="Продукт ждемс" dense style="width: 100%"> </q-input>
      <q-input label="Цена" dense style="width: 100%"></q-input>
    </div>
  </ark-card>
</template>
<script>
import { ref } from "vue";
import ArkCard from "components/Card/ArkCard.vue";
import SelectStore from "components/select/SelectStore.vue";
import SelectDateExt from "components/select/SelectDateExt.vue";
export default {
  props: [""],
  components: {
    ArkCard,
    SelectStore,
    SelectDateExt,
  },
  setup() {
    const title = "Пример";
    const subTitle = "суб пример";
    return {
      title,
      subTitle,
    };
  },
};
</script>
