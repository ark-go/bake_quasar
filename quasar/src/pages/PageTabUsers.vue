<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <users></users>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Users from "components/Users.vue";

export default defineComponent({
  name: "PageTabUsers",
  components: {
    Users,
    
  },
});
</script>
