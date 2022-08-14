<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-expansion-item
      dense-toggle
      v-model="sideExpand"
      :label="selectedRowDoc.datestart || 'Документ'"
      :caption="selectedRowDoc.trademark_name"
      header-style="padding-right:1px"
    >
      <!-- <template v-slot:header>
        <span class="text-weight-bold" style="width: 100%">{{
          spravStore.selectedRow.name
        }}</span>
      </template> -->
      <q-card>
        <q-card-section> Поиск / фильтр !! </q-card-section>
      </q-card>
      <q-item
        clickable
        v-ripple
        @click="onClickEdit"
        v-if="!!selectedRowDoc.id"
      >
        <q-item-section>Изменить документ</q-item-section>
      </q-item>
      <q-item
        clickable
        v-ripple
        v-if="!!selectedRowDoc.id"
        @click="onClickDelete"
      >
        <q-item-section>Удалить документ</q-item-section>
      </q-item>
    </q-expansion-item>
    <q-item clickable v-ripple @click="onClickNew">
      <q-item-section>Новый документ</q-item-section>
    </q-item>
    <q-item v-if="!!selectedRowDoc.id" clickable v-ripple @click="onClickExcel">
      <q-item-section>Экспорт в EXCEL</q-item-section>
    </q-item>
  </q-list>
</template>
<!-- v-if="userStore.userInfo.email == 'Arkadii@yandex.ru'" -->
<script>
import { defineComponent, ref } from "vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useUserStore } from "src/stores/userStore";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: {},
  props: ["refTable", "activeTab"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    //  const priceStore = useSpravStore();
    const { selectedRowDoc } = storeToRefs(usePriceStore());
    const userStore = useUserStore();
    console.log("Выбрана строка", selectedRowDoc.value);
    function onClickEdit() {
      emit("onClickEdit");
    }
    function onClickNew() {
      emit("onClickNew");
    }
    function onClickDelete() {
      emit("onClickDelete");
    }
    function onClickExcel() {
      emit("onClickExcel");
    }
    return {
      selectedRowDoc,
      onClickEdit,
      onClickNew,
      onClickDelete,
      onClickExcel,
      //  priceStore,
      sideExpand: ref(false),
      userStore,
    };
  },
});
</script>
