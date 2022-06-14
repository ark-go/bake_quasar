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
      @lazy-load="lazyLoad"
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
              Еще...
              <!-- sub menuha -->
              <q-menu
                anchor="top end"
                self="top start"
                @hide="hideUpdate"
                @show="showUpdate(prop.node)"
              >
                <q-list>
                  <q-item
                    v-if="memoryCutNode"
                    clickable
                    v-close-popup
                    @click.exact="onPaste(prop.node, 'over')"
                    @click.shift.exact="onPaste(prop.node, 'after')"
                    @click.ctrl.exact="onPaste(prop.node, 'before')"
                  >
                    <q-item-section>
                      <q-item-label>Вставить</q-item-label>
                      <q-item-label caption>{{
                        memoryCutNode.name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="onСut(prop.node)">
                    <q-item-section>Вырезать</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="onDelete(prop.node.id)"
                  >
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
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
import { dataLoad } from "src/utils/ark.js";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "UserRoleTree",
  components: {
    ArkCard,
  },
  setup() {
    //  const $q = useQuasar();
    const $router = useRouter();
    const treeNodes = ref([]);
    const expanded = ref([]);
    const selectedNode = ref("");
    const selectedKey = ref("");
    const newDesc = ref("");
    const newName = ref("");
    const refTree = ref();
    const memoryCutNode = ref("");
    onMounted(async () => {
      const arr = await loadDepartments();
      treeNodes.value = arr.nodes.sort(compareName);
      console.log("Load", arr);
    });
    async function lazyLoad(details) {
      const arr = await loadDepartments({
        root: details.node.root,
        lft: details.node.lft,
        rgt: details.node.rgt,
        level: details.node.level,
      });

      console.log("lazy", details.node, details.node.lft);
      console.log("res lazy", arr.nodes);
      details.done(arr.nodes.sort(compareSortLft));
    }
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
        role_id: 1, //newName.value,
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
      memoryCutNode.value = "";
      console.log("delete", id);
      let res = await depAddDell("delete", { id: id });
      if (res.nodes) treeNodes.value = treeToJson2(res.nodes);
    }
    async function onPaste(node, mode) {
      // задаем пункту из памяти parent_id, id тукущего пункта
      await moveNode(memoryCutNode.value, node, mode);
      // await onUpdate(memoryCutNode.value.id, id);
      memoryCutNode.value = "";
    }
    function deleteNodeFromTree(node, nodeId) {
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          let filtered = node.children.filter((f) => f.nodeId == nodeId);
          if (filtered && filtered.length > 0) {
            node.children = node.children.filter((f) => f.nodeId != nodeId);
            return;
          }
          deleteNodeFromTree(node.children[i], nodeId);
        }
      }
    }
    function updateNodeInTree(node, nodeId, newNode) {
      if (node.id == nodeId) {
        console.log("нашли ", node, "заменяем на", newNode);
        node.children = newNode;
        node.name = "kkkkkk";
        console.log("итого ", node);
        return node;
      } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          updateNodeInTree(node.children[i], nodeId, newNode);
        }
      }
    }
    async function treeCommand(cmd, dat) {
      let res = await dataLoad(
        "/api/userroletree",
        { ...dat, ...{ cmd: cmd } },
        "Удаление дерева"
      );
      if (res.error) {
        console.log("Ошибка treeCommand", res.error);
      }
      return res?.result || null;
    }
    async function moveNode(from, to, mode) {
      let dat = {
        from: from.id,
        to: to.id,
        hitmode: mode,
      };
      let res = await treeCommand("move", dat);
      if (!res) return; // была ошибка ничего не делаем, анализируем ??
      const arr = await loadDepartments();
      treeNodes.value = arr.nodes.sort(compareName);

      /*
     res = res[0];
      // idout тоже что и
      const fromRoot = res.fromRoot; // из какого дерева брали
      const fromPath = res.fromPath; // путь переносимого
      const toRoot = res.toRoot; // в какое дерево перенесли
      const toPath = res.toPath; // в конец этого пути чтото вставили
      const endRoot = res.endRoot; // итоговое дерево
      const endPath = res.endPath; // полный путь

      //  toRoot и  toPath говорят о месте вставки т.е. это однозначный родитель

      console.log("Пришло это: ", res);
      // определить если деревья разные
      // если деревья одинаковые
      if (fromRoot == toRoot) {
        const idNode = toPath[toPath.length - 1]; // узел надо удалить и закрыть
        console.log("Вставляем в конец этого: ", idNode);
        nextTick(() => {
          if (refTree.value.isExpanded(idNode)) {
            refTree.value.setExpanded(idNode, false);
          }
        });
        let oneRes = await loadDepartments({ id: idNode });
        console.log("скачали узел:", idNode, oneRes.nodes);
        let toInsert = oneRes.nodes[0].lft - 1; // это у скачанного

        let FF = treeNodes.value[0];
        // console.log("1", FF);
        deleteNodeFromTree(FF, from.id);
        updateNodeInTree(FF, toInsert, oneRes.nodes);
        console.log("2", FF);
        // treeNodes.value[0] = FF;
        console.log(">>", JSON.stringify(treeNodes.value, 0, 2));

        // let nodeCl = refTree.value.getNodeByKey(idNode);
        // console.log("Нашли узел:", nodeCl);
        // nodeCl = oneRes.nodes[0];
        // console.log("Вставили:", nodeCl);
        // treeNodes.value.find((o, i) => {
        //   console.log("o.id: ", o.id, idNode, treeNodes.value[i]);
        //   if (o.id == idNode) {
        //     console.log("Меняем это:", treeNodes.value[i]);
        //     treeNodes.value[i] = oneRes.nodes[0];
        //     return true; // stop searching
        //   }
        // });
      }

      // if (res[0].endPath.length == 1) {
      //   // вставили а путь без родителя, перечитываем все
      //   const arr = await loadDepartments();
      //   treeNodes.value = arr.nodes.sort(compareName);
      //   return;
      // }
      // //! Надо прочитать само дерево с корня
      // //! у него меняются границы при изменении состава.
      // //! надо перечитать целиком нулевой уровень корня.

      // if (res[0].endPath.length > 1) {
      //   // вставили когото к родителю
      //   // посмотрим кто это
      //   // console.log("parent:", res[0].endPath.slice(-2)[0]);
      //   console.log("Родитель:", res[0].endPath[0]); // пока берем корень
      //   let rootId = res[0].endPath[0];
      //   let oneRes = await loadDepartments({ id: rootId });

      //   // let nodeCl = refTree.value.getNodeByKey(from.id);
      //   //! Здесь должны закрыть и перечитать дерево из которого удалили ключ
      //   let obj1 = treeNodes.value.find((o, i) => {
      //     if (o.id == rootId) {
      //       console.log("прочитали", oneRes.nodes[0]);
      //       console.log("удалить должны", treeNodes.value[i]);
      //       //treeNodes.value[from.id];
      //       return true; // stop searching
      //     }
      //   });
      //   // здесь вставляем то что перенесли
      //   if (oneRes.nodes?.length > 0) {
      //     console.log("что прочитали", oneRes.nodes);
      //     //treeNodes.value
      //     let obj = treeNodes.value.find((o, i) => {
      //       if (o.id == rootId) {
      //         console.log("прочитали", oneRes.nodes[0]);
      //         console.log("вставлять сюда", treeNodes.value[i]);
      //         treeNodes.value[i] = oneRes.nodes[0];
      //         return true; // stop searching
      //       }
      //     });
      //     // nodeCl = { ...oneRes.nodes[0] };
      //   }

      //   nextTick(() => {
      //     if (refTree.value.isExpanded(rootId)) {
      //       refTree.value.setExpanded(rootId, false);
      //     }
      //   });
      // }
      */
    }
    async function onUpdate(id, parent_id = "", sorted = "") {
      console.log("update", id);
      let dat = {
        id: id,
        parent_id: parent_id,
        name: newName.value,
        sorted: sorted || selectedNode.value.sorted,
      };
      let res = await depAddDell("update", dat);
      if (res.nodes) {
        treeNodes.value = treeToJson2(res.nodes);

        nextTick(() => {
          if (!refTree.value.isExpanded(parent_id || id)) {
            refTree.value.setExpanded(parent_id || id, true);
          }
          selectedKey.value = res.currentId;
        });
      }
      newDesc.value = "";
      newName.value = "";
      console.log("added", res);
    }
    async function loadDepartments(dat) {
      let res = await dataLoad(
        "/api/userroletree",
        { ...{ cmd: "load" }, ...dat },
        "Чтение дерева"
      );
      return res?.result;
    }
    async function depAddDell(cmd, dat) {
      let res = await dataLoad(
        "/api/userroletree",
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
    function compareSortLft(a, b) {
      // Используем toUpperCase() для преобразования регистра
      const genreA = parseInt(a.lft);
      const genreB = parseInt(b.lft);

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
      const genreA = parseInt(a.sorted);
      const genreB = parseInt(b.sorted);

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
        }
      }
      console.log("raz", tree);
      tree.sort(compareSort);
      console.log("dva", tree);
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
      memoryCutNode,
      newDesc,
      newName,
      lazyLoad,
      hideUpdate() {
        newName.value = "";
        newDesc.value = "";
      },
      onСut(id) {
        memoryCutNode.value = id;
      },
      showUpdate(node) {
        newName.value = node.name;
        newDesc.value = node.description;
      },
      onPaste,
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
