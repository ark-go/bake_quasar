<template>
  <q-list>
    <user-account></user-account>
  </q-list>
</template>

<script>
import { defineComponent, ref } from "vue";
import userAccount from "./userAccount.vue";

export default defineComponent({
  name: "RightItems",
  components: {
    userAccount,
  },
  setup() {
    return {};
  },
});
</script>
