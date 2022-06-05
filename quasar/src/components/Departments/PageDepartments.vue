<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <Departments-Tree></Departments-Tree>
    <User-Role-Tree></User-Role-Tree>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import DepartmentsTree from "./DepatmentsTree.vue";
import UserRoleTree from "components/UserRoles/UserRoleTree.vue";
export default defineComponent({
  name: "DepartMents",
  components: { DepartmentsTree, UserRoleTree },
});
</script>
