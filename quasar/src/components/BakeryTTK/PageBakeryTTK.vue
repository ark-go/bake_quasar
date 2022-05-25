<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <Bakery-TTK></Bakery-TTK>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import BakeryTTK from "./BakeryTTK.vue";
export default defineComponent({
  name: "PageBakeryTTK",
  components: { BakeryTTK },
});
</script>
