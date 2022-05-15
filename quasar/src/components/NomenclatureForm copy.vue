<template>
  <div class="column" style="width: 250px">
    <select-id-name
      :allData="vidnomencl"
      v-model="vidNomenclCurr /*Вид номенклатуры*/"
    ></select-id-name>
    <q-input v-model="nameNomenclCurr" label="Наименование" />

    <select-id-name
      :allData="unit"
      v-model="unitCurr /*Единицы измерения*/"
    ></select-id-name>
    <select-id-name
      v-show="isRaw"
      :allData="groupRaw"
      v-model="groupRawCurr /* Группа сырья */"
    ></select-id-name>
    <select-id-name
      v-show="isRaw"
      :allData="vidRaw"
      v-model="vidRawCurr /* Вид сырья */"
    ></select-id-name>
    <br />
    <div class="row fit">
      <q-btn outline round color="indigo" icon="add" @click="onClickNewUser" />
      <q-btn
        v-show="!isNewUser && showButton"
        outline
        round
        color="red"
        icon="delete_forever"
        @click="onClickDelete"
      />
      <q-btn
        v-show="showButton"
        outline
        rounded
        color="indigo"
        :label="isNewUser ? 'Добавить' : 'Заменить'"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script>
import { ref, toRefs, toRef, watch, onMounted } from "vue";
import { axios } from "boot/axios";
import { useQuasar } from "quasar";
//import SelectNomenclName from "components/select/SelectNomenclName.vue";
import SelectIdName from "components/select/SelectIdName.vue";
export default {
  name: "NomenclatureForm",
  components: {
    SelectIdName,
    // SelectNomenclName,
  },
  props: ["dataRow", "spravAll"],
  setup(props, { emit }) {
    const { notify } = useQuasar();
    const action = ref("Заменить");

    const nameNomencl = ref(null);
    const nameNomenclCurr = ref("");
    const isNewUser = ref(true);
    const showButton = ref(false);
    const vidnomencl = ref(null);
    const vidNomenclCurr = ref(null);

    const unit = ref(null);
    const unitCurr = ref(null);
    const groupRaw = ref(null);
    const groupRawCurr = ref(null);
    const vidRaw = ref(null);
    const vidRawCurr = ref(null);
    const currentNomenclID = ref(null);
    const isRaw = ref(true);
    const isRecept = ref(true);
    // const dataForm = ref({});
    // const isEditData = ref(false);
    // const { email, username, u_fam, u_name, u_otch } = toRefs(props.data);
    const getUserProps = async () => {
      showButton.value = true;
      currentNomenclID.value = props.dataRow.value.nomencl_id;
      nameNomenclCurr.value = props.dataRow.value.nomencl_name;
      // nameNomencl Curr.value = {
      //   value: props.dataRow.value.nomencl_id,
      //   label: props.dataRow.value.nomencl_name,
      // };
      vidNomenclCurr.value = {
        value: props.dataRow.value.vidnomencl_id,
        label: props.dataRow.value.vidnomencl_name,
        meta: props.dataRow.value.vidnomencl_meta,
      };
      unitCurr.value = {
        value: props.dataRow.value.unit_id,
        label: props.dataRow.value.unit_name,
      };
      groupRawCurr.value = {
        value: props.dataRow.value.groupraw_id,
        label: props.dataRow.value.groupraw_name,
      };
      vidRawCurr.value = {
        value: props.dataRow.value.vidraw_id,
        label: props.dataRow.value.vidraw_name,
      };
      console.log("name nomencl:", nameNomenclCurr.value);
      // dataForm.value = {

      // }
      isNewUser.value = false;
      action.value = "Заменить";
    };
    const password = ref("");
    function updateSpravAll() {
      // ----------- vidnomencl -------- Вид номенклатуры
      vidnomencl.value = {
        options: props.spravAll.value.vidnomencl,
        nameLabel: "Вид номенклатуры",
      };
      vidNomenclCurr.value = null;
      // ----------- nomencl ---- Название номенклатуры
      // nameNomencl.value = {
      //   options: null,
      //   nameLabel: "Наименование",
      // };
      //nameNomencl Curr.value = null;
      // ----------- unit -------------- Единицы измерения
      unit.value = {
        options: props.spravAll.value.unit,
        nameLabel: "Ед.Изм.",
      };
      unitCurr.value = null;
      // ----------- groupRaw ---------- группа сырья
      console.log("test unit", unit.value);
      groupRaw.value = {
        options: props.spravAll.value.groupraw,
        nameLabel: "Группа сырья.",
      };
      groupRawCurr.value = null;
      // ---------- vidRaw ------------ Вид сырья
      vidRaw.value = {
        options: props.spravAll.value.vidraw,
        nameLabel: "Вид сырья.",
      };
      vidRawCurr.value = null;
    }
    watch(props.spravAll, updateSpravAll);
    //onMounted(updateSpravAll);
    watch(props.dataRow, getUserProps);
    watch(vidNomenclCurr, () => {
      isRaw.value = vidNomenclCurr.value?.meta?.isRaw;
      isRecept.value = vidNomenclCurr.value?.meta?.isRecept;
      console.log(
        "watch form vidNomenclCurr",
        vidNomenclCurr.value?.meta,
        isRaw.value,
        isRecept.value
      );
    });

    //onMounted(getUserProps);
    async function onClickDelete() {
      let data = {
        //   nomenclature: nomenclature.value
        nomencl_id: currentNomenclID.value, // раз мы обнавляем, значит берем тот который пришел
      };
      let result = await updateDelete(data); //!  UPDATE ЗДЕСЬ !!!!
      resultatCheck(result);
    }
    async function onClick() {
      // -----------------
      let data = {
        //   nomenclature: nomenclature.value
        nomencl_id: currentNomenclID.value, // раз мы обнавляем, значит берем тот который пришел
        // nomencl_id: nameNomencl Curr.value.value,
        //nomencl_name: nameNomencl Curr.value?.label,
        nomencl_name: nameNomenclCurr.value,
        vidnomencl_id: vidNomenclCurr.value?.value,
        unit_id: unitCurr.value?.value,
        groupraw_id: groupRawCurr.value?.value,
        vidraw_id: vidRawCurr.value?.value,
      };

      console.log("На запись", data);
      let result = null;
      // -------------------------
      if (isNewUser.value) {
        result = await addData(data);
      } else {
        //data.nomencl_id = currentNomenclID.value; // раз мы обнавляем, значит берем тот который пришел
        result = await updateData(data); //!  UPDATE ЗДЕСЬ !!!!
      }
      resultatCheck(result);
    }
    function resultatCheck(result) {
      if (!result?.error) {
        isNewUser.value = false;
        notify({
          color: "green",
          position: "top",
          message: result?.message ? result.message : "Нет сообщения 01",
          icon: "report_problem",
        });
        console.log("Отправка на обновлнение..........");
        emit("updateTable", vidNomenclCurr.value);
        //---
        showButton.value = false;

        nameNomenclCurr.value = null;
        vidNomenclCurr.value = null;
        unitCurr.value = null;
        groupRawCurr.value = null;
        vidRawCurr.value = null;
        //---
      } else {
        notify({
          color: "negative",
          position: "top",
          message: result?.error,
          icon: "report_problem",
        });
      }
    }
    function onClickNewUser() {
      isNewUser.value = true;
      showButton.value = true;
      nameNomenclCurr.value = null;
      vidNomenclCurr.value = null;
      unitCurr.value = null;
      groupRawCurr.value = null;
      vidRawCurr.value = null;
      action.value = "Добавить";
    }
    return {
      isRaw,
      isRecept,
      vidnomencl,
      vidNomenclCurr,
      unit,
      unitCurr,
      groupRaw,
      groupRawCurr,
      vidRaw,
      vidRawCurr,
      isNewUser,
      showButton,
      action,
      nameNomencl,
      nameNomenclCurr,
      onClick,
      onClickNewUser,
      onClickDelete,
    };
  },
};
async function addData(data) {
  try {
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

<style></style>
