<template>
  <q-list>
    <user-account></user-account>
    <setup-Current-Page v-if="!!currentPage"></setup-Current-Page>
  </q-list>
</template>

<script>
import { defineComponent, ref } from "vue";
import userAccount from "./userAccount.vue";
import setupCurrentPage from "./setupCurrentPage.vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";

export default defineComponent({
  name: "RightItems",
  components: {
    userAccount,
    setupCurrentPage,
  },
  setup() {
    const { currentPage } = storeToRefs(usePagesSetupStore());
    return { currentPage };
  },
});
</script>
