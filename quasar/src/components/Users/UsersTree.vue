<template>
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
    :accordion="false"
    v-model:expanded="expanded"
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
                  <q-item-section class="no-outline" tabindex="0">
                    <q-item-label caption> Новый пункт </q-item-label>
                    <q-input v-model="newName" label="Название" autofocus />
                    <q-input v-model="newDesc" label="Комментарий" />
                    <q-separator inset></q-separator>
                    <q-item-label class="items-center">
                      <span>Вставить: </span>
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        icon="arrow_downward"
                        flat
                        round
                        dense
                        color="primary"
                        @click="onInsert(prop.node, 'after')"
                      />
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        icon="arrow_upward"
                        flat
                        round
                        dense
                        color="primary"
                        @click="onInsert(prop.node, 'before')"
                      />
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        icon="arrow_forward"
                        flat
                        round
                        dense
                        color="primary"
                        @click="onInsert(prop.node, 'over')"
                      />
                    </q-item-label>
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
                <q-item v-if="memoryCutNode" clickable v-close-popup>
                  <q-item-section>
                    <q-item-label class="items-center">
                      <span>Вставить: </span>
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        icon="arrow_downward"
                        flat
                        round
                        dense
                        color="primary"
                        @click="onPaste(prop.node, 'after')"
                      />
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        icon="arrow_upward"
                        flat
                        round
                        dense
                        color="primary"
                        @click="onPaste(prop.node, 'before')"
                      />
                      <q-btn
                        v-close-popup
                        style="margin-top: 5px"
                        icon="arrow_forward"
                        flat
                        round
                        dense
                        color="primary"
                        @click="onPaste(prop.node, 'over')"
                      />
                    </q-item-label>
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
                  @click="onInsert(prop.node, 'delete')"
                >
                  <q-item-section>Удалить</q-item-section>
                </q-item>
                <q-item
                  v-if="isRoot"
                  clickable
                  v-close-popup
                  @click="onNewRoot(prop.node, 'newRoot')"
                >
                  <q-item-section>Новый корень</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
        </q-list>
      </q-menu>
    </template>
  </q-tree>
</template>

<script>
import {
  defineComponent,
  ref,
  unref,
  onMounted,
  nextTick,
  onUnmounted,
} from "vue";
import { dataLoad } from "src/utils/ark.js";
//import { useQuasar } from "quasar";
import { emitter } from "boot/axios.js";
import { useRouter } from "vue-router";
import { useIoSocket } from "stores/ioSocket.js";

export default defineComponent({
  name: "UsersTree",
  components: {},
  setup() {
    //  const $q = useQuasar();
    const $router = useRouter();
    const ioSocket = useIoSocket();
    const treeNodes = ref([]);
    const expanded = ref([]);
    const selectedNode = ref("");
    const selectedKey = ref("");
    const newDesc = ref("");
    const newName = ref("");
    const refTree = ref();
    const isRoot = ref(false);
    const memoryCutNode = ref(null);

    async function reloadTree() {
      const arr = await loadDepartments();
      treeNodes.value = arr.nodes.sort(compareSortLft);
      console.log("Load tree", arr);
    }
    onMounted(async () => {
      await reloadTree();
      emitter.on("on-reload-tree", reloadTree);
    });
    onUnmounted(() => {
      emitter.off("on-reload-tree", reloadTree);
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
    function goNode(arr) {
      arr.forEach((val) => {
        console.log(
          val,
          refTree.value.getNodeByKey(val),
          refTree.value.isExpanded(val)
        );
        // if (!refTree.value.isExpanded("" + val)) {
        refTree.value.setExpanded(val, true);
        selectedKey.value = val;
        // }
      });
    }
    async function treeCommand(cmd, dat) {
      let res = await dataLoad(
        "/api/userroletree",
        { ...dat, ...{ cmd: cmd } },
        "Дерево"
      );
      if (res.error) {
        console.log("Ошибка treeCommand", res.error);
      }
      ioSocket.socket.emit("system_website", {
        room: "system web arkadii",
        msg: "on-reload-tree",
      });
      return res?.result || null;
    }
    async function moveNode(from, to, mode) {
      let dat = {
        from: from.id,
        to: to.id,
        hitmode: mode,
      };
      let res = await treeCommand("move", dat);
      if (!res || !Array.isArray(res)) return; // была ошибка ничего не делаем, анализируем ??
      const arr = await loadDepartments();
      treeNodes.value = arr.nodes.sort(compareSortLft);
      console.log("move", res);

      nextTick(() => {
        if (res[0].endPath) {
          // полный путь
          //  for (let i = 0; i < 10000; i++) {
          goNode(res[0].endPath);
          //  }
        }
      });
    }
    async function insertNode(to, mode) {
      let dat = {
        to: to.id,
        name: newName.value,
        descript: newDesc.value, // не используем еще
        hitmode: mode,
      };
      let res = await treeCommand("insert", dat);
      if (!res) return; // была ошибка ничего не делаем, анализируем ??
      const arr = await loadDepartments();
      treeNodes.value = arr.nodes.sort(compareSortLft);
    }
    async function onPaste(node, mode) {
      // задаем пункту из памяти узел node, куда node, и mode
      if (memoryCutNode.value) {
        await moveNode(memoryCutNode.value, node, mode);
        memoryCutNode.value = null;
      }
    }
    async function onNewRoot(node, mode) {
      let res = await treeCommand("insert", { hitmode: "newRoot" });
      if (!res) return; // была ошибка ничего не делаем, анализируем ??
      const arr = await loadDepartments();
      treeNodes.value = arr.nodes.sort(compareSortLft);
      newDesc.value = "";
      newName.value = "";
    }
    async function onInsert(node, mode) {
      console.log("onInsert", node);
      await insertNode(node, mode);
      newDesc.value = "";
      newName.value = "";
    }

    async function onUpdate(id, parent_id = "", sorted = "") {
      console.log("update", id);
      let dat = {
        id: id,
        parent_id: parent_id,
        name: newName.value,
        sorted: sorted || selectedNode.value.sorted,
      };
      let res = await updateNode("update", dat);
      if (res.nodes) {
        const arr = await loadDepartments();
        treeNodes.value = arr.nodes.sort(compareSortLft);
      }
      newDesc.value = "";
      newName.value = "";
      console.log("Update", res);
    }
    async function loadDepartments(dat) {
      let res = await dataLoad(
        "/api/userroletree",
        { ...{ cmd: "load" }, ...dat },
        "Чтение дерева"
      );
      return res?.result;
    }
    async function updateNode(cmd, dat) {
      let res = await dataLoad(
        "/api/userroletree",
        { ...dat, ...{ cmd: cmd } },
        "Обновление дерева"
      );
      ioSocket.socket.emit("system_website", {
        room: "system web arkadii",
        msg: "on-reload-tree",
      });
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
      let genreA = parseInt(a.lft);
      let genreB = parseInt(b.lft);
      if (a.level == 0) {
        genreA = a.name.toUpperCase();
        genreB = b.name.toUpperCase();
      }
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
            compareSortLft
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

      isRoot.value = node.lft == 1 ? true : false;
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
    }
    return {
      isRoot,
      memoryCutNode,
      newDesc,
      newName,
      lazyLoad,
      hideUpdate() {
        newName.value = "";
        newDesc.value = "";
      },
      onСut(node) {
        memoryCutNode.value = node;
      },
      showUpdate(node) {
        newName.value = node.name;
        newDesc.value = node.description;
      },
      onPaste,
      onUpdate,
      onInsert,
      onNewRoot,
      refTree,
      selectedKey,
      rightClick,
      onDblClick,
      treeNodes,
      expanded,
      selectedNode,
      buttonArr,
      buttonClick,
    };
  },
});
</script>
