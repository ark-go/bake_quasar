<template>
  <div class="column" style="width: 250px">
    <q-input
      :readonly="!isNewUser"
      v-model="email"
      label="E-mail"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="username"
      label="Username"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="u_fam"
      label="Фамилия"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="u_name"
      label="Имя"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="u_otch"
      label="Отчество"
      color="indigo"
      autocomplete="off"
      dense
    />
    <q-input
      v-model="password"
      label="Пароль"
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
import { ref, watch, onMounted } from "vue";
import { axios } from "boot/axios";
import { useQuasar } from "quasar";
export default {
  props: ["data"],
  setup(props, { emit }) {
    const { notify } = useQuasar();
    const action = ref("Заменить");
    const email = ref("");
    const username = ref("");
    const u_fam = ref("");
    const u_name = ref("");
    const u_otch = ref("");
    const isNewUser = ref(true);
    // const { email, username, u_fam, u_name, u_otch } = toRefs(props.data);
    const getUserProps = async () => {
      email.value = props.data.value?.email; // props.data.email.value;
      username.value = props.data.value?.username;
      u_fam.value = props.data.value?.u_fam;
      u_name.value = props.data.value?.u_name;
      u_otch.value = props.data.value?.u_otch;
      isNewUser.value = false;
      action.value = "Заменить";
    };
    const password = ref("");
    watch(props.data, getUserProps);
    onMounted(getUserProps);
    async function onClick() {
      let data = {
        email: email.value,
        password: password.value,
        username: username.value,
        u_fam: u_fam.value,
        u_name: u_name.value,
        u_otch: u_otch.value,
      };
      let result = null;
      if (isNewUser.value) {
        result = await addUser(data);
      } else {
        result = await updateUser(data);
      }
      if (!result?.error) {
        isNewUser.value = false;
        emit("updateTable");
        notify({
          color: "green",
          position: "top",
          message: result?.message ? result.message : "Нет сообщения 01",
          icon: "report_problem",
        });
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
      email.value = ""; // props.data.email.value;
      username.value = "";
      u_fam.value = "";
      u_name.value = "";
      u_otch.value = "";
      action.value = "Добавить";
    }
    return {
      isNewUser,
      action,
      email,
      username,
      u_fam,
      u_name,
      u_otch,
      password,
      onClick,
      onClickNewUser,
    };
  },
};
async function addUser(data) {
  try {
    let resp = await axios.post("/api/addUser", data);
    let result = resp.data;
    console.log("addUser", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "UsersForm: Ошибка добавления пользователя (addUser)",
    };
  }
}
async function updateUser(data) {
  try {
    let resp = await axios.post("/api/updateUser", data);
    let result = resp.data;
    console.log("updateUser", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "UsersForm: Ошибка обновления пользователя (updateUser)",
    };
  }
}
</script>

<style></style>
