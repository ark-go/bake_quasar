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
      class="non-selectable text-no-wrap"
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
    >
      <template v-slot:body-description="prop">
        <span class="text-weight-thin" style="font-size: 0.8em">{{
          prop.node.description
        }}</span>
      </template>
      <template v-slot:default-header="prop">
        <div class="row items-center" @click="clickTreeNode(prop.node.key)">
          <div class="">{{ prop.node.label }}</div>
        </div>
      </template>
    </q-tree>
    <!-- </q-scroll-area> -->
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import TreeModel from "tree-model";

export default defineComponent({
  name: "SpravTree",
  components: {},
  props: {
    selectedNode: Object,
  },
  emits: ["update:selectedNode"],
  setup(props, { emit }) {
    const expanded = ref([]);
    const selected = ref(null);
    const refTree = ref(null);
    const filter = ref("");
    const filterRef = ref(null);
    function clickTreeNode(key) {
      // let node = refTree.value.getNodeByKey(key);
      let isExp = refTree.value.isExpanded(key);
      refTree.value.setExpanded(key, !isExp);
    }
    function onSelected(key /* node-key */) {
      let node = refTree.value.getNodeByKey(key);
      if (node) {
        let parentNode = getParentTree(node.key);
        if (parentNode && parentNode.length > 1)
          node.parent = parentNode[parentNode.length - 2];
        if (parentNode) {
          let pathStr = [];
          parentNode.forEach((node) => {
            pathStr.push(node.label);
          });
          node.allParents = parentNode;
          node.pathStr = pathStr.join(" | ");
        }
        emit("update:selectedNode", node);
      }
      console.log("on selected tree", key, node);
    }
    function getParentTree(key) {
      let parents = [];
      let tree = new TreeModel();
      dataTree.forEach((element) => {
        let rootMain = tree.parse(element);
        rootMain.walk(function (node) {
          if (node.model.key === key) {
            let x = node.getPath();
            x.forEach((element) => {
              parents.push(element.model);
            });
          }
        });
      });
      return parents;
    }

    return {
      refTree,
      filter,
      filterRef,
      onSelected,
      dataTree,
      expanded,
      selected,
      clickTreeNode,
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
    label: "Контрагенты",
    helpCode: "TreeHelp-1", //! менять коды нельзя.. это ключи в базу данных
    //icon: "restaurant_menu",
    children: [
      { key: 11, label: "Вид контрагента", tableName: "kagentvid" },
      { key: 12, label: "Вид регистрации", tableName: "kagentvidreg" },
      { key: 13, label: "Группы контрагента", tableName: "kagentgroup" },
    ],

    // { label: " ? Вид регистрации", tableName: "kage+ntvidreg" },
    // { label: " ? Вид контрагента", tableName: "kage+ntvid" },
  },
  {
    key: 2,
    label: "Торговые сети",
    helpCode: "TreeHelp-2", //! менять коды нельзя.. это ключи в базу данных
    // icon: "room_service",
    disabled: false,
    children: [
      { key: 21, label: "Бренды", tableName: "brand" },
      {
        key: 22,
        label: "Сети",
        tableName: "trademark",
        tableType: "trademark",
        //children: [{ key: 28, label: "Бреxxxнды", tableName: "brand" }],
      }, //tableName: "brand"
    ],
  },
  {
    key: 3,
    label: "Пекарни структура",
    helpCode: "TreeHelp-3", //! менять коды нельзя.. это ключи в базу данных
    // icon: "room_service",
    disabled: false,
    children: [
      {
        key: 31,
        label: "Пекарни (помещения с тандыром)",
        //tableName: "bakery", // tableType: "bakery",
        tableName: "tabBakery", // имя для запроса на сервер
        tableType: "tabBakery", //! убрать после замены всех таблиц - не скоро, оперделяет что таблица внешняя
        component: "TabBakery", // расширение по умолчанию vue
        buttonPanel: [
          // { name: "bakeryBaker", label: "Пекари", icon: "person" }, // панель вверху
          //  { name: "manager", label: "Менеджер", icon: "person" },
        ],
      },
      // {
      //   key: 32,
      //   label: "Территории (группы пекарен)",
      //   description: "по территориям",
      //   tableName: "territory",
      //   component: "TabTerritory", // расширение по умолчанию vue
      //   buttonPanel: [
      //     { name: "bakeryTerritory", label: "Пекарни", icon: "home" },
      //     // { name: "manager", label: "Менеджер", icon: "person" },
      //   ],
      // },
      {
        key: 321,
        label: "Территории (группы пекарен)",
        description: "по территориям",
        tableName: "tabTerritory",
        tableType: "tabTerritory",
        component: "TabTerritory", // расширение по умолчанию vue
        buttonPanel: [
          { name: "bakeryTerritory", label: "Пекарни", icon: "home" },
          // { name: "manager", label: "Менеджер", icon: "person" },
        ],
      },
      {
        key: 33,
        label: "Регионы (группы территорий)",
        // tableName: "region",
        tableName: "tabRegion",
        tableType: "tabRegion",
        component: "TabRegion", // расширение по умолчанию vue
        //  tableType: "bakery",
        buttonPanel: [
          { name: "TabRegion", label: "Территории", icon: "terrain" },
          //  { name: "manager", label: "Менеджер", icon: "person" },
        ],
      },

      // { key: 34, label: "Регионы", tableName: "region", component: "Tabxxx" },
      {
        key: 35,
        label: "Менеджеры (управляющие)",
        tableName: "tabUsers",
        tableType: "tabUsers",
        component: "TabManager", // расширение по умолчанию vue, будет TabManager.vue
        buttonPanel: [
          // name - название панели в TabManager.vue
          { name: "managerRegion", label: "Регионы", icon: "terrain" },
          { name: "managerTerritory", label: "Территории", icon: "terrain" },
          { name: "managerBakery", label: "Пекарни", icon: "home" },
        ],
      },
      { key: 36, label: "Города", tableName: "city", tableType: "city" },
    ],
  },
  // {
  //   key: 4,
  //   label: "Ассортимент",
  //   // icon: "room_service",
  //   disabled: false,
  //   children: [
  //     { key: 41, label: "Вид ассортимента", tableName: "" },
  //     { key: 42, label: "Вид продукта", tableName: "" },
  //     { key: 43, label: "Вид сырья", tableName: "" },
  //     { key: 44, label: "Группа сырья", tableName: "", tableType: "" },
  //   ],
  // },
  // {
  //   key: 10,
  //   label: "Разное",
  //   // icon: "room_service",
  //   disabled: false,
  //   children: [{ key: 101, label: "Единицы измерения", tableName: "" }],
  // },
];
</script>
