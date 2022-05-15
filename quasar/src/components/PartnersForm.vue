<template>
  <div class="column" style="width: 250px">
    <q-input
      :readonly="!isNewUser"
      v-model="partner"
      label="Контрагент"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="typepartner"
      label="Тип контрагента"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="typeregistracion"
      label="Тип регистрации"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="grouppartner"
      label="Группа контрагента"
      color="indigo"
      autocomplete="off"
      dense
    />

    <br />
    <div class="row fit">
      <q-btn outline round color="indigo" icon="add" @click="onClickNewUser" />
      <q-btn
        v-show="!isNewUser"
        outline
        round
        color="red"
        icon="delete_forever"
        @click="onClick"
      />

      <q-btn
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
export default {
  props: ["data"],
  setup(props, { emit }) {
    const { notify } = useQuasar();
    const action = ref("Заменить");

    const partner = ref("");
    const typepartner = ref("");
    const typeregistracion = ref("");
    const grouppartner = ref("");

    const isNewUser = ref(true);
    // const isEditData = ref(false);
    // const { email, username, u_fam, u_name, u_otch } = toRefs(props.data);
    const getUserProps = async () => {
      partner.value = props.data.value?.partner; // props.data.email.value;
      typepartner.value = props.data.value?.typepartner;
      typeregistracion.value = props.data.value?.typeregistracion;
      grouppartner.value = props.data.value?.grouppartner;
      isNewUser.value = false;
      action.value = "Заменить";
    };
    const password = ref("");
    watch(props.data, getUserProps);
    onMounted(getUserProps);
    async function onClick() {
      let data = {
        partner: partner.value,
        typepartner: typepartner.value,
        typeregistracion: typeregistracion.value,
        grouppartner: grouppartner.value,
      };
      let result = null;
      if (isNewUser.value) {
        result = await addData(data);
      } else {
        result = await updateData(data); //!  UPDATE ЗДЕСЬ !!!!
      }
      if (!result?.error) {
        isNewUser.value = false;
        notify({
          color: "green",
          position: "top",
          message: result?.message ? result.message : "Нет сообщения 01",
          icon: "report_problem",
        });
        emit("updateTable");
        //---
        partner.value = "";
        typepartner.value = "";
        typeregistracion.value = "";
        grouppartner.value = "";
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
      partner.value = "";
      typepartner.value = "";
      typeregistracion.value = "";
      grouppartner.value = "";
      action.value = "Добавить";
    }
    return {
      isNewUser,
      action,
      partner,
      typepartner,
      typeregistracion,
      grouppartner,
      onClick,
      onClickNewUser,
    };
  },
};
async function addData(data) {
  try {
    let resp = await axios.post("/api/addPartners", data);
    let result = resp.data;
    console.log("addPartners", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "PartnersForm: Ошибка добавления номенклатуры (addPartners)",
    };
  }
}
async function updateData(data) {
  try {
    let resp = await axios.post("/api/updatePartners", data);
    let result = resp.data;
    console.log("updatePartners", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "PartnersForm: Ошибка обновления контрагента (updatePartners)",
    };
  }
}
</script>

<style></style>
