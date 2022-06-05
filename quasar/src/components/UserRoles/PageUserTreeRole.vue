<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <User-Role-Tree></User-Role-Tree>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import UserRoleTree from "./DepatmentsTree.vue";
export default defineComponent({
  name: "PageUserTreeRole",
  components: { UserRoleTree },
});
</script>
