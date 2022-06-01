<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <Departments-Tree></Departments-Tree>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import DepartmentsTree from "./DepatmentsTree.vue";
export default defineComponent({
  name: "DepartMents",
  components: { DepartmentsTree },
});
</script>
