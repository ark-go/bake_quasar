<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-expansion-item
      dense-toggle
      v-model="sideExpand"
      :label="selectedRowBakery.bakery_name || 'Выбери пекарню'"
      :caption="
        selectedRowBakery.kagent_franch_name
          ? 'аренда:' + selectedRowBakery.kagent_franch_name
          : ''
      "
      header-style="padding-right:1px"
    >
      <!-- <template v-slot:header>
        <span class="text-weight-bold" style="width: 100%">{{
          spravStore.selectedRow.name
        }}</span>
      </template> -->
      <q-card>
        <q-card-section> ? </q-card-section>
      </q-card>
      <!-- <q-item
        clickable
        v-ripple
        @click="onClickEdit"
        v-if="!!selectedRowBakery.id"
      >
        <q-item-section>Изменить пекарню</q-item-section>
      </q-item> -->
      <q-item
        clickable
        v-ripple
        v-if="selectedBakeryPrice.length > 0"
        @click="$emit('onClickDelete')"
      >
        <q-item-section>Удалить выбраные</q-item-section>
      </q-item>
    </q-expansion-item>
    <q-item clickable v-ripple @click="onShowSelectBakery">
      <q-item-section>Добавить пекарни</q-item-section>
    </q-item>
    <q-item>
      <q-item-section id="bakeryTeleport"></q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { defineComponent, ref } from "vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc5",
  components: {},
  props: ["refTable", "activeTab"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    //  const priceStore = useSpravStore();
    const { selectedRowBakery, selectBakeryShow, selectedBakeryPrice } =
      storeToRefs(usePriceStore());
    console.log("Выбрана строка", selectedRowBakery.value);
    function onClickEdit() {
      emit("onClickEdit");
    }
    function onShowSelectBakery() {
      selectBakeryShow.value = true;
      emit("onShowSelectBakery");
    }
    return {
      selectedRowBakery,
      selectedBakeryPrice,
      onClickEdit,
      onShowSelectBakery,
      //  priceStore,
      sideExpand: ref(false),
    };
  },
});
</script>
