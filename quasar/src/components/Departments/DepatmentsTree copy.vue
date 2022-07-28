<template>
  <ark-card
    class="ark-scroll"
    title="Дерево"
    subTitle="зачем нам дерево ?"
    style="max-width: 1024px; min-width: 500px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Не жми' }"
    @menuClick="menuClick"
  >
    <q-tree
      ref="refTree"
      :nodes="treeNodes"
      node-key="id"
      label-key="name"
      selected-color="primary"
      no-nodes-label="Нет данных"
      no-selection-unset
      v-model:selected="selectedKey"
      no-connectors
      accordion="true"
      v-model:expanded="expanded"
      @update:selected="onSelectNode"
      @click.right.stop.prevent
    >
      <template v-slot:default-header="prop">
        <div
          :id="prop.node.id"
          @click.right="rightClick($event, prop.node)"
          @dblclick="onDblClick($event, prop.node)"
          :class="[
            { 'text-weight-bold': prop.node.id === selectedKey },
            'text-primary',
            'text-no-wrap',
            'non-selectable',
          ]"
        >
          {{ prop.node.name }}
          <q-tooltip
            :delay="1000"
            anchor="bottom middle"
            max-width="250px"
            style="max-width: 250px; font-size: 14px"
          >
            <span style="color: rgb(127, 209, 127)">{{ prop.node.name }}</span>
            <br />
            {{ prop.node.description }}
          </q-tooltip>
        </div>
        <q-menu context-menu anchor="top right" self="top left">
          <q-list style="min-width: 100px">
            <q-item clickable>
              Добавить
              <!-- sub menuha -->
              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption> Новый пункт </q-item-label>
                      <q-input v-model="newName" label="Название" />
                      <q-input v-model="newDesc" label="Комментарий" />
                      <q-separator inset></q-separator>
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        flat
                        rounded
                        dense
                        color="primary"
                        label="Добавить"
                        @click.exact="onAdd(prop.node.id)"
                        @click.shift.exact="onAdd(prop.node.id, true)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item clickable>
              Изменить
              <!-- sub menuha -->
              <q-menu
                anchor="top end"
                self="top start"
                @hide="hideUpdate"
                @show="showUpdate(prop.node)"
              >
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption> Изменить пункт </q-item-label>
                      <q-input v-model="newName" label="Название" />
                      <q-input v-model="newDesc" label="Комментарий" />
                      <q-separator inset></q-separator>
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        flat
                        rounded
                        dense
                        color="primary"
                        label="Сохранить"
                        @click="onUpdate(prop.node.id)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item clickable>
              Переместить
              <!-- sub menuha -->
              <q-menu
                anchor="top end"
                self="top start"
                @hide="hideUpdate"
                @show="showUpdate(prop.node)"
              >
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption> Переместить пункт </q-item-label>
                      <q-item-label>{{ memoryName || newName }} </q-item-label>
                      <q-item-label caption lines="2">{{
                        memoryDesc || newDesc
                      }}</q-item-label>
                      <q-separator inset></q-separator>

                      <q-btn
                        v-if="memoryName"
                        v-close-popup
                        style="margin-top: 5px"
                        flat
                        rounded
                        dense
                        color="primary"
                        label="Вставить"
                        @click="onMoveMemory()"
                      />
                      <q-btn
                        v-else
                        v-close-popup
                        style="margin-top: 5px"
                        flat
                        rounded
                        dense
                        color="primary"
                        label="Запомнить"
                        @click="onSaveMemory()"
                      />
                      <q-btn
                        v-if="memoryName"
                        v-close-popup
                        style="margin-top: 5px"
                        flat
                        rounded
                        dense
                        color="primary"
                        label="Забыть"
                        @click="onClearMemory()"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item clickable v-close-popup @click="onDelete(prop.node.id)">
              <q-item-section>Удалить</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </q-tree>
  </ark-card>
</template>

<script>
import { defineComponent, ref, unref, onMounted, nextTick } from "vue";
import ArkCard from "components/Card/ArkCard.vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "DepatmentsTree",
  components: {
    ArkCard,
  },
  setup() {
    //  const $q = useQuasar();
    const arkUtils = useArkUtils();
    const $router = useRouter();
    const treeNodes = ref([]);
    const expanded = ref([]);
    const selectedNode = ref("");
    const selectedKey = ref("");
    const newDesc = ref("");
    const newName = ref("");
    const refTree = ref();
    const memoryName = ref("");
    const memoryDesc = ref("");
    onMounted(async () => {
      const arr = await loadDepartments();
      if (arr.nodes) {
        treeNodes.value = treeToJson2(arr.nodes);
      }
      console.log("tree", treeNodes.value);
    });
    function onSelectNode(node) {
      console.log("Selectnode", node);
    }
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
    async function onAdd(id, shift) {
      console.log("add", id);
      let dat = {
        parent_id: shift ? null : id,
        name: newName.value,
        description: newDesc.value,
      };

      let res = await depAddDell("add", dat); //здесь id будет parent_id
      if (res.nodes) {
        treeNodes.value = treeToJson2(res.nodes);

        nextTick(() => {
          if (!refTree.value.isExpanded(id)) {
            refTree.value.setExpanded(id, true);
          }
          selectedKey.value = res.currentId;
        });
      }
      newDesc.value = "";
      newName.value = "";
      console.log("added", res);
    }
    async function onDelete(id) {
      console.log("delete", id);
      let res = await depAddDell("delete", { id: id });
      if (res.nodes) treeNodes.value = treeToJson2(res.nodes);
    }
    async function onUpdate(id, sorted = "") {
      console.log("update", id);
      let dat = {
        id: id,
        name: newName.value,
        description: newDesc.value,
        sorted: sorted || selectedNode.value.sorted,
      };
      let res = await depAddDell("update", dat);
      if (res.nodes) {
        treeNodes.value = treeToJson2(res.nodes);

        nextTick(() => {
          if (!refTree.value.isExpanded(id)) {
            refTree.value.setExpanded(id, true);
          }
          selectedKey.value = res.currentId;
        });
      }
      newDesc.value = "";
      newName.value = "";
      console.log("added", res);
    }
    async function loadDepartments() {
      let res = await arkUtils.dataLoad(
        "/api/departments",
        { cmd: "load" },
        "Чтение дерева"
      );
      return res?.result;
    }
    async function depAddDell(cmd, dat) {
      let res = await arkUtils.dataLoad(
        "/api/departments",
        { ...dat, ...{ cmd: cmd } },
        "Удаление дерева"
      );
      return res?.result || [];
    }
    function treeToJson(arr) {
      //  return new Promise((resolve, reject) => {
      const { res } = arr.reduce(
        (acc, curr) => {
          if (acc.parentMap[curr.parent_id]) {
            (acc.parentMap[curr.parent_id].children =
              acc.parentMap[curr.parent_id].children || []).push(curr);
          } else {
            acc.res.push(curr);
          }
          acc.parentMap[curr.id] = curr;
          return acc;
        },
        { parentMap: {}, res: [] }
      );
      return res;
    }
    function compareName(a, b) {
      // Используем toUpperCase() для преобразования регистра
      const genreA = a.name.toUpperCase();
      const genreB = b.name.toUpperCase();

      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    }
    function compareSort(a, b) {
      // Используем toUpperCase() для преобразования регистра
      const genreA = a.sorted;
      const genreB = b.sorted;

      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    }
    function treeToJson2(array) {
      let tree = [],
        arrayDictionary = {};

      // Сначала сопоставьте узлы массива с объектом/словарем, где ключом является их идентификатор.
      array.forEach((cat) => {
        arrayDictionary[cat.id] = cat;
        arrayDictionary[cat.id]["children"] = [];
      });

      // для каждой записи в словаре
      for (var entry in arrayDictionary) {
        // получить все данные для этой записи в словаре
        const mappedElem = arrayDictionary[entry];

        // если у элемента есть родитель, добавьте его
        if (
          mappedElem.parent_id && // у словаря есть родитель
          arrayDictionary[mappedElem["parent_id"]] // и этот родитель существует
        ) {
          arrayDictionary[mappedElem["parent_id"]]["children"].push(mappedElem);
          arrayDictionary[mappedElem["parent_id"]]["children"].sort(
            compareName
          ); // будут тормоза
        }
        //остальное находится на корневом уровне (parent_id = null or 0)
        else {
          tree.push(mappedElem);
          tree.sort(compareSort);
        }
      }
      return tree;
      //console.log(tree);
    }
    async function rightClick(event, node) {
      console.log("right click", node);
      selectedNode.value = node;
      selectedKey.value = node.id;
      // await nextTick();
    }
    function onDblClick(event, node) {
      console.log("onDblClick click", node);
      //let nodeCl = refTree.value.getNodeByKey(node.id);
      if (refTree.value.isExpanded(node.id)) {
        refTree.value.setExpanded(node.id, false);
      } else {
        refTree.value.setExpanded(node.id, true);
      }
      //if (node.id != this.selectedKey) return;
      //console.log("двойной клик ", node.id, node);
      //   if (node.children) {
      //     this.$refs.tree.setExpanded(
      //       "" + node.id,
      //       !this.$refs.tree.isExpanded("" + node.id)
      //     );
      //   }
    }
    return {
      memoryName,
      memoryDesc,
      newDesc,
      newName,
      hideUpdate() {
        newName.value = "";
        newDesc.value = "";
      },
      onMoveMemory() {},
      onClearMemory() {
        memoryName.value = "";
        memoryDesc.value = "";
      },
      onSaveMemory() {
        memoryName.value = unref(newName.value);
        memoryDesc.value = unref(newDesc.value);
      },
      showUpdate(node) {
        newName.value = node.name;
        newDesc.value = node.description;
      },
      onUpdate,
      onDelete,
      onAdd,
      refTree,
      selectedKey,
      rightClick,
      onDblClick,
      treeNodes,
      expanded,
      selectedNode,
      onSelectNode,
      buttonArr,
      buttonClick,
      menuClick(val) {
        console.log("Менюшка", val);
      },
    };
  },
});
</script>
