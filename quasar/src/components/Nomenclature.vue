<template>
  <div class="flex flex-center">
    <div class="q-pa-md" :style="{ maxWidth: $q.screen.width + 'px' }">
      <q-table
        style="min-width: 150px"
        :visible-columns="visibleColumns"
        dense
        no-data-label="Нет данных."
        no-results-label="Ничего не найдено."
        :filter="filter"
        class="my-sticky-virtscroll-table non-selectable"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="email"
        title="Номенклатура"
        :rows="rows"
        :columns="columns"
        @row-dblclick="dblClickRow"
        @row-contextmenu.prevent="contextTable"
        :loading="loading"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Поиск"
            autocomplete="off"
            name="tabNomencl"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="close"
                class="cursor-pointer"
                @click.stop="filter = ''"
              />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-checkbox
            v-model="extendedTable"
            checked-icon="star"
            unchecked-icon="star_border"
            indeterminate-icon="help"
          />
        </template>
        <template v-slot:top-left>
          <select-id-name
            :allData="vidnomencl"
            v-model="vidNomenclCurr"
          ></select-id-name>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-blue text-bold"
              style="font-weight: bold; font-size: 0.8rem"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="vah(props)">
            {{ props.value }}
            <q-menu context-menu>
              <q-list style="min-width: 100px">
                <div style="text-align: center; background-color: silver">
                  {{ props.row.nomencl_name }}
                </div>
                <q-item
                  clickable
                  v-close-popup
                  @click="clickMenuEdit(props.row)"
                >
                  <q-item-section>Изменить</q-item-section>
                </q-item>
                <q-item
                  v-if="props.row.recept_check == 'есть'"
                  clickable
                  v-close-popup
                  @click="clickRecepts(props.row)"
                >
                  <q-item-section>Рецепты</q-item-section>
                </q-item>
                <q-item
                  v-if="
                    !(props.row.recept_check == 'есть') &&
                    props.row.vidnomencl_meta.isRecept
                  "
                  clickable
                  v-close-popup
                  @click="emit('newRecept', props.row)"
                >
                  <q-item-section>Создать рецепт</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-td>
        </template>
        <template v-slot:no-data="dataslot">
          <no-data-footer :dataslot="dataslot"></no-data-footer>
        </template>
      </q-table>
      <br />
      <q-btn
        outline
        rounded
        color="indigo"
        label="Добавить"
        v-model="menuModel"
        @click="onClickaddNomencl"
      />
    </div>
  </div>
  <teleport to="body">
    <div
      v-show="modalNomenclOpen"
      @click.self="modalNomenclOpen = false"
      class="modal1 flex flex-center ark-popup shadow-6"
    >
      <div class="ark-popup-body">
        <pop-nomenclature-form
          :sprav-all="spravAll"
          :dataRow="editData"
          @update-table="updateTable"
          @close="modalNomenclOpen = false"
        ></pop-nomenclature-form>
      </div>
    </div>
  </teleport>
  <!-- <teleport to="body">
    <div
      v-show="newReceptModal"
      @click.self="newReceptModal = false"
      class="modal1 flex flex-center ark-popup shadow-6"
    >
      <div class="ark-popup-body">
        <new-recept-modal
          :row="newReceptProps"
          @edit-recept="(val) => emit('editRecept', val)"
          @close-modal="newReceptModal = false"
        >
        </new-recept-modal>
      </div>
    </div>
  </teleport> -->
</template>

<script>
import { ref, onMounted, reactive, watch, computed, toRefs } from "vue";
import { axios, emitter } from "boot/axios";
//import NomenclatureForm from "components/NomenclatureForm.vue";
import PopNomenclatureForm from "components/PopNomenclatureForm.vue";
import SelectIdName from "components/select/SelectIdName.vue";
//import PopupAddNomencl from "components/PopupAddNomencl.vue";
//import NewReceptModal from "components/NewReceptModal.vue";
import NoDataFooter from "components/NoDataFooter.vue";
import { useQuasar } from "quasar";

export default {
  name: "NomenClature",
  components: {
    // NomenclatureForm,
    PopNomenclatureForm,
    SelectIdName,
    //  NewReceptModal,
    NoDataFooter,
    //  PopupAddNomencl,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const test = ref("");
    let rows = ref([]);
    const editData = reactive({});
    const spravAll = reactive({});
    const loading = ref(false);
    const vidnomencl = ref(null);
    const vidNomenclCurr = ref(null);
    const isRaw = ref(false);
    const isRecept = ref(false);
    const visibleColumns = ref([]);
    const extendedTable = ref(false);
    const modalNomenclOpen = ref(false);
    const editRowNomencl = ref(null);
    const filter = ref("");
    const menuTarget = ref(false);
    const menuModel = ref(false);
    const newReceptModal = ref(false);
    const newReceptProps = ref({});
    watch(extendedTable, () => {
      changeVidNomencl();
    });
    const changeVidNomencl = async () => {
      isRaw.value = vidNomenclCurr.value.meta?.isRaw;
      isRecept.value = vidNomenclCurr.value.meta?.isRecept;
      updateTable(); // без параметра  даные о виде отсюда
      visibleColumns.value = [];
      columnsAll.forEach((item, index, array) => {
        if (item == "groupraw_name" || item == "vidraw_name") {
          if (!isRaw.value) return;
          visibleColumns.value.push(item);
          return;
        }
        if (item == "recept_check" && !isRecept.value) return;
        if (item == "vidnomencl_name") return;
        if (!extendedTable.value) {
          if (
            item == "user_date" ||
            item == "user_email" ||
            item == "nomencl_meta"
          )
            return;
        }
        visibleColumns.value.push(item);
      });

      console.log("visible: ", visibleColumns.value);
    };
    watch(vidNomenclCurr, changeVidNomencl);

    const mount = async () => {
      filter.value = "";
      loading.value = true;
      let spr = await dataLoadSpr();
      if (spr?.error) {
      } else {
        spravAll.value = spr;
        console.log("VID", spravAll.value.vidnomencl);
        vidnomencl.value = {
          options: spravAll.value.vidnomencl,
          nameLabel: "Вид номенклатуры",
        };
        console.log("VID", vidnomencl.value.options[0]);
        if (vidnomencl.value.options.length > 0) {
          vidNomenclCurr.value = vidnomencl.value.options[0];
          test.value = "Mounted";
          const m = await dataLoad(vidNomenclCurr.value.value);
          rows.value = m.result || [];
          loading.value = false;
        }
        // console.log("Справочники Load", spr);
      }
    };
    onMounted(mount);

    function onClickaddNomencl() {
      //  editRowNomencl.value = null;
      // editData.value = {};
      //  vidNomenclCurr.value = {
      //   value: props.dataRow.value?.vidnomencl_id,
      //   label: props.dataRow.value?.vidnomencl_name,
      //   meta: props.dataRow.value?.vidnomencl_meta,
      // };
      editData.value = {
        vidnomencl_name: vidNomenclCurr.value.label,
        vidnomencl_id: vidNomenclCurr.value.value,
        vidnomencl_meta: vidNomenclCurr.value.meta,
      };
      console.log("open new", editData.value);
      modalNomenclOpen.value = true;
    }
    function dblClickRow(evt, row, idx) {
      // editRowNomencl.value = { ...row };
      // modalNomenclOpen.value = true;
      //editData.value = { email: "98888777" };
      // editData.value = { ...row }; //  = reactive(row); //toRefs(row);
      //console.log("dblCick1:", row);
      editData.value = row;
      console.log("dblCick2:", editData.value);
      modalNomenclOpen.value = true;
    }
    function contextTable(evt, row, idx) {
      menuTarget.value = evt.PointerEvent;
      menuModel.value = true;
      console.log("contest:", evt);
    }
    async function updateTable(vidNomencl) {
      modalNomenclOpen.value = false;
      // если с параметром то пришло от формы, надо обновит здешний VidNomencl
      // если без параметра то уже со здешнего пришло, обновлять его не надо
      console.log(
        "Получено на обновлнение..........",
        vidNomenclCurr.value,
        "----",
        vidNomencl
      );
      if (vidNomencl) vidNomenclCurr.value = vidNomencl;
      if (!vidNomenclCurr.value?.value) {
        console.log("Нет данных для обновления VidNomenclCurr");
        return;
      }
      //console.log()
      console.log("updateTable:", vidNomenclCurr.value?.value);
      loading.value = true;
      const m = await dataLoad(vidNomenclCurr.value.value);
      console.log("updateTable2:", m.result);
      rows.value = m.result || [];
      loading.value = false;
    }
    function saveNomencl() {}
    function removeNomencl() {}
    return {
      $q,
      emit,
      updateTable,
      extendedTable,
      editRowNomencl,
      saveNomencl,
      removeNomencl,
      modalNomenclOpen,
      onClickaddNomencl,
      isRaw,
      isRecept,
      visibleColumns,
      vidnomencl,
      vidNomenclCurr,
      loading,
      filter,
      editData,
      spravAll,
      test,
      columns,
      rows,
      pagination: ref({
        rowsPerPage: 10,
      }),
      dblClickRow,
      readonlyinput: ref(true),
      menuTarget,
      contextTable,
      menuModel,

      vah(val) {
        // console.log(">> >", val);
        return val;
      },
      clickMenuEdit(row) {
        // console.log("nomencl_id:", row);
        editData.value = row;
        console.log("clickMenuEdit:", editData.value);
        modalNomenclOpen.value = true;
      },

      clickRecepts(row) {
        emit("showRecepts", row); // to PageNomenclature
      },
      newReceptModal,
      newReceptProps,
      xx(val) {
        console.log("XXXXxxx:", val);
      },
    };
  },
};
async function dataLoadSpr() {
  try {
    let resp = await axios.post("/api/nomenclLoadSpr", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "nomenclLoad: Ошибка чтения данных (nomenclLoad)",
    };
  }
}
async function dataLoad(vidNomencl) {
  try {
    let resp = await axios.post("/api/nomenclLoad", {
      vidNomencl: vidNomencl,
    });
    let data = resp.data;
    console.log("dataLoad vidNomencl:", data, vidNomencl);
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "nomenclLoad: Ошибка чтения данных (nomenclLoad)",
    };
  }
}
const columnsAll = [
  "vidnomencl_name",
  "nomencl_name",
  "unit_name",
  "groupraw_name",
  "vidraw_name",
  "recept_check",
  "user_date",
  "user_email",
  "nomencl_meta",
];
const columns = [
  {
    name: "vidnomencl_name",
    label: "Вид",
    field: "vidnomencl_name",
    align: "left",
    sortable: true,
  },
  {
    name: "nomencl_name",
    label: "Наименование",
    field: "nomencl_name",
    align: "left",
    sortable: true,
  },
  {
    name: "unit_name",
    required: true,
    label: "Ед.измерения",
    align: "left",
    field: "unit_name",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "groupraw_name",
    align: "left",
    label: "Группа сырья",
    field: "groupraw_name",

    sortable: true,
  },
  {
    name: "vidraw_name",
    label: "Тип",
    field: "vidraw_name",
    align: "left",
    sortable: true,
  },
  {
    name: "recept_check",
    label: "Рецепт",
    align: "center",
    field: "recept_check",
    sortable: true,
  },
  {
    name: "user_date",
    label: "Дата",
    field: "user_date",
    sortable: true,
  },
  {
    name: "user_email",
    label: "Редактировал",
    field: "user_email",
    sortable: true,
  },
  {
    name: "nomencl_meta",
    label: "meta",
    field: "nomencl_meta",
    sortable: true,
  },
];
</script>

<style lang="scss" scoped>
.modal1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}

.ark-popup-body {
  background-color: white;
}
.ark-popup {
  background-color: rgba(123, 123, 124, 0.5);
}
</style>
