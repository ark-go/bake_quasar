<template>
  <q-page class="flex flex-center ark"> <menu-grid></menu-grid> </q-page>
</template>

<script>
import { defineComponent } from "vue";
import MenuGrid from "./MenuGrid.vue";
export default defineComponent({
  name: "PageIndex",
  components: { MenuGrid },
});
</script>
<style lang="scss" scoped>
// .ark {
//   background-image: url("/bg/pattern-vintage-small.svg");
// }
</style>
