<template>
  <div class="column">
    <q-input ref="filterRef" dense v-model="filter" label="Фильтр">
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>
    <!-- <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px"
    > -->
    <q-tree
      class="non-selectable"
      :ref="(el) => (refTree = el)"
      :nodes="dataTree"
      node-key="key"
      v-model:selected="selected"
      no-connectors
      accordion
      no-nodes-label="Нет узлов"
      no-results-label="Ничего не найдено"
      selected-color="blue"
      v-model:expanded="expanded"
      @update:selected="onSelected"
      :no-selection-unset="true"
      :filter="filter"
    />
    <!-- </q-scroll-area> -->
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";

export default defineComponent({
  name: "ProductsTree",
  components: {},
  props: {
    // selectedNode: Object,
    onSelectedNode: Function,
  },
  emits: ["update:selectedNode", "onSelectedNode"],
  setup(props, { emit }) {
    const expanded = ref([1]);
    const selected = ref(null);
    const refTree = ref(null);
    const filter = ref("");
    const filterRef = ref(null);
    // watch(selected, (val, m, k) => {
    //   console.log("SelecteNode", val, m, k);
    // });
    onMounted(() => {
      selected.value = "start"; // установим выбор
      onSelected("start"); // вызовем событие?
      // let nodeStat = refTree.value.getNodeByKey("start");
      // console.log(nodeStat);
      // nodeStat.selected = true;
      //  onSelected("start");
    });
    function onSelected(key /* node-key */) {
      let node = refTree.value.getNodeByKey(key);
      let isExp = refTree.value.isExpanded(key);
      console.log("раскрыт", key, isExp);
      refTree.value.setExpanded(key, !isExp);
      //node = refTree.value.getNodeByKey(key); // после снятия
      if (node) emit("update:selectedNode", node);
      console.log("on selected tree", key, node);
      emit("onSelectedNode", node);
    }
    return {
      refTree,
      filter,
      filterRef,
      onSelected,
      dataTree,
      expanded,
      selected,

      resetFilter() {
        filter.value = "";
        filterRef.value.focus();
      },

      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2,
      },
    };
  },
});
/**
 *  tableType -  указать тип таблицы
 *  key - любой не может повторятся
 *  tableName - имя таблицы в базе
 *  tableType = название таблицы для вывода.
 *  Без указания tableType, считается таблица по умолчанию [id,name]
 */
const dataTree = [
  {
    key: 1,
    label: "Продукция",
    //icon: "restaurant_menu",
    disabled: false,
    children: [
      {
        key: "start",
        label: "Продукция",
        table: "products",
        //selectable: true,
      },
      {
        key: 12,
        label: "Товар",
        table: "productvid",
      },
      {
        key: 13,
        label: "Ассортимент",
        table: "productassortment",
      },
      {
        key: 14,
        label: "Тип продукции",
        table: "producttype",
      },
    ],

    // let DialogForm = () => import('../components/DialogForm.vue')
  },
  {
    key: 2,
    label: "Сырье",
    //icon: "restaurant_menu",
    disabled: false,
    children: [
      { key: 22, label: "Cырьё", table: "productraw" },

      { key: 23, label: "Тип сырья", table: "productrawvid" },
    ],

    // let DialogForm = () => import('../components/DialogForm.vue')
  },
];
</script>
