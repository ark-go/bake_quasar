<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-expansion-item
      dense-toggle
      v-model="sideExpand"
      :label="selectedRowPrice.article || 'Товар'"
      :caption="selectedRowPrice.price_name"
      header-style="padding-right:1px"
    >
      <!-- <template v-slot:header>
        <span class="text-weight-bold" style="width: 100%">{{
          spravStore.selectedRow.name
        }}</span>
      </template> -->
      <q-card>
        <q-card-section>
          <div
            v-if="selectedRowPrice.id"
            class="info-block"
            column
            style="font-size: 0.8em"
          >
            <div><span>Артикул: </span>{{ selectedRowPrice.article }}</div>
            <div><span>Товар: </span>{{ selectedRowPrice.price_name }}</div>
            <div>
              <span>Продукт: </span>{{ selectedRowPrice.productvid_name }}
            </div>
            <div><span>Цена: </span>{{ selectedRowPrice.cena }}</div>
            <div><span></span>{{ selectedRowPrice.description }}</div>
          </div>
        </q-card-section>
      </q-card>
      <q-item
        clickable
        v-ripple
        @click="onClickEdit"
        v-if="!!selectedRowPrice.id"
      >
        <q-item-section>Изменить позизию.</q-item-section>
      </q-item>
      <q-item clickable v-ripple v-if="!!selectedRowPrice.id" @click="onDelete">
        <q-item-section>Удалить позицию.</q-item-section>
      </q-item>
    </q-expansion-item>
    <q-item clickable v-ripple @click="onClickNew">
      <q-item-section>Добавление новой позиции.</q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { defineComponent, ref } from "vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: {},
  props: ["refTable", "activeTab"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    //  const priceStore = useSpravStore();
    const { selectedRowPrice } = storeToRefs(usePriceStore());
    console.log("Выбрана строка", selectedRowPrice.value);
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
      selectedRowPrice,
      onClickEdit,
      onClickNew,
      onDelete,
      //  priceStore,
      sideExpand: ref(false),
    };
  },
});
</script>
