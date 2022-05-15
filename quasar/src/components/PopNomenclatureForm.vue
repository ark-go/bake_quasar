<template>
  <q-card flat bordered class="my-card bg-grey-1">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ titlePopup }}</div>
          <div class="text-subtitle2">{{ subTitlePopup }}</div>
        </div>
        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable>
                  <q-item-section @click="save">Записать</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="emit('close')"
                    >Закрыть</q-item-section
                  >
                </q-item>
                <q-item v-show="currentNomenclID" clickable>
                  <q-item-section @click="onUpdateDeleteConfirm"
                    >Удалить</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <nomenclature-form
        :sprav-all="spravAll"
        :data-row="dataRow"
        @update-table="updateTable"
        @change-form-data="changeFormData"
        :resultCheck="resultCheck"
      ></nomenclature-form>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat @click="save">Записать</q-btn>
      <q-btn flat @click="emit('close')">Закрыть</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { ref, watch, toRefs, onMounted } from "vue";
import { axios } from "boot/axios";
import NomenclatureForm from "components/NomenclatureForm.vue";
import { useQuasar } from "quasar";
export default {
  props: ["dataRow", "spravAll"],
  components: {
    NomenclatureForm,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const resultCheck = ref({});
    const isUpdateNomencl = ref(false);
    const formData = ref({});
    const currentNomenclID = ref(null);
    const subTitlePopup = ref("");
    const titlePopup = ref("");
    onMounted(() => {
      currentNomenclID.value = props.dataRow.value?.nomencl_id;
    });

    watch(props.dataRow, () => {
      currentNomenclID.value = props.dataRow.value?.nomencl_id;
      if (currentNomenclID.value) {
        titlePopup.value = "Редактирование";
        subTitlePopup.value = props.dataRow.value?.nomencl_name;
      } else {
        titlePopup.value = "Новая продукция ??";
        subTitlePopup.value = "введите данные";
      }
    });
    function changeFormData(val) {
      formData.value = val.value;
      isUpdateNomencl.value = val.value?.nomencl_id;
      console.log("changeFormData:", isUpdateNomencl.value);
    }

    async function save() {
      let result = null;
      console.log("save:", isUpdateNomencl.value, formData.value);
      if (isUpdateNomencl.value) {
        result = await updateData(formData.value);
      } else {
        result = await addData(formData.value); //!  UPDATE ЗДЕСЬ !!!!
      }
      //resultatCheck(result);
      resultCheck.value = result;
      console.log("resultCheck.v", resultCheck.value);
    }
    function onUpdateDeleteConfirm() {
      $q.dialog({
        title: "Удалить номенклатуру?",
        message: props.dataRow.value?.nomencl_name,
        cancel: true,
        persistent: true,
        ok: {
          push: false,
        },
        cancel: {
          push: false,
          label: "Отменить",
          color: "negative",
        },
      })
        .onOk(async () => {
          await onUpdateDelete();
        })
        .onCancel(() => {
          return;
        });
    }
    async function onUpdateDelete() {
      let data = {
        nomencl_id: currentNomenclID.value, // раз мы обнавляем, значит берем тот который пришел
      };
      let result = await updateDelete(data); //!  UPDATE ЗДЕСЬ !!!!
      resultCheck.value = result;
    }
    return {
      emit,
      updateTable: (val) => {
        emit("updateTable", val);
      },
      changeFormData,
      resultCheck,
      save,
      formData,
      onUpdateDelete,
      onUpdateDeleteConfirm,
      currentNomenclID,
      subTitlePopup,
      titlePopup,
    };
  },
};
async function addData(data) {
  try {
    console.log("nomenclAdd-1", data);
    let resp = await axios.post("/api/nomenclAdd", data);
    let result = resp.data;
    console.log("nomenclAdd", result);

    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "nomenclAdd: Ошибка добавления номенклатуры (nomenclAdd)",
    };
  }
}
async function updateData(data) {
  try {
    console.log("nomenclUpdate1", data);
    let resp = await axios.post("/api/nomenclUpdate", data);
    let result = resp.data;
    console.log("nomenclUpdate", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "nomenclUpdate: Ошибка обновления номенклатуры (nomenclUpdate)",
    };
  }
}
async function updateDelete(data) {
  try {
    let resp = await axios.post("/api/nomenclDelete", data);
    let result = resp.data;
    console.log("nomenclDelete", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "nomenclDelete: Ошибка удаления номенклатуры (nomenclDelete)",
    };
  }
}
</script>
<style lang="scss" scoped></style>
