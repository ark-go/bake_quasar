<template>
  <div class="column" style="width: 250px">
    <q-input
      :readonly="!isNewUser"
      v-model="bakehouse"
      label="Пекарня"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="region"
      label="Регион"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="territory"
      label="Территория"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="own"
      label="Принадлежность"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="city"
      label="Город"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="brandname"
      label="Бренд"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="distributing"
      label="Торговая сеть"
      color="indigo"
      autocomplete="off"
      dense
    />
    <select-user-by-fam v-model="selectAdminDate"></select-user-by-fam>
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
import SelectUserByFam from "components/select/SelectUserByFam.vue";
export default {
  props: ["data"],
  components: {
    SelectUserByFam,
  },
  setup(props, { emit }) {
    const { notify } = useQuasar();
    const action = ref("Заменить");
    const region = ref("");
    const territory = ref("");
    const own = ref("");
    const city = ref("");
    const brandname = ref("");
    const distributing = ref("");
    const bakehouse = ref("");
    const administering = ref("");
    const isNewUser = ref(true);
    const selectAdminDate = ref({});
    // const isEditData = ref(false);
    // const { email, username, u_fam, u_name, u_otch } = toRefs(props.data);
    const getUserProps = async () => {
      region.value = props.data.value?.region; // props.data.email.value;
      territory.value = props.data.value?.territory;
      own.value = props.data.value?.own;
      city.value = props.data.value?.city;
      brandname.value = props.data.value?.brandname;
      distributing.value = props.data.value?.distributing;
      bakehouse.value = props.data.value?.bakehouse;
      administering.value = props.data.value?.administering;
      isNewUser.value = false;
      action.value = "Заменить";
      selectAdminDate.value = {
        label: props.data.value?.administering,
        value: props.data.value?.administering_id,
      };
    };
    const password = ref("");
    watch(props.data, getUserProps);
    onMounted(getUserProps);
    async function onClick() {
      let data = {
        region: region.value,
        territory: territory.value,
        own: own.value,
        city: city.value,
        brandname: brandname.value,
        distributing: distributing.value,
        bakehouse: bakehouse.value,
        //  administering: administering.value,
        administering: selectAdminDate.value.label,
        administering_id: selectAdminDate.value.value,
      };
      let result = null;
      if (isNewUser.value) {
        result = await addBakehouses(data);
      } else {
        result = await updateBakehouses(data); //!  UPDATE ЗДЕСЬ !!!!
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
        region.value = "";
        territory.value = "";
        own.value = "";
        city.value = "";
        brandname.value = "";
        distributing.value = "";
        bakehouse.value = "";
        administering.value = "";
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
      region.value = "";
      territory.value = "";
      own.value = "";
      city.value = "";
      brandname.value = "";
      distributing.value = "";
      bakehouse.value = "";
      administering.value = "";
      action.value = "Добавить";
    }
    return {
      selectAdminDate,
      isNewUser,
      action,
      region,
      territory,
      own,
      city,
      brandname,
      distributing,
      bakehouse,
      administering,
      onClick,
      onClickNewUser,
    };
  },
};
async function addBakehouses(data) {
  try {
    let resp = await axios.post("/api/addBakehouses", data);
    let result = resp.data;
    console.log("addBakehouses", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "BakehousesForm: Ошибка добавления пекарни (addBakehouses)",
    };
  }
}
async function updateBakehouses(data) {
  try {
    let resp = await axios.post("/api/updateBakehouses", data);
    let result = resp.data;
    console.log("updateBakehouses", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "BakehousesForm: Ошибка обновления пекарни (updateBakehouses)",
    };
  }
}
</script>

<style></style>
