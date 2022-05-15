<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <login></login>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Login from "components/FormLogin.vue";
export default defineComponent({
  name: "PageLogin",
  components: {
    Login,
  },
});
</script>
