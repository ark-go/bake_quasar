<template>
  <div
    class="column no-wrap"
    style="display: grid; justify-items: center; text-align-last: center"
  >
    Таблица не подключена<br />{{ tableInfo.label }} ({{ tableInfo.tableName }})
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    tableInfo: Object,
  },
  name: "NoTable",
  components: {},
});
</script>
