<template>
  <div class="grid-main maxBodyHeight">
    <div class="item-1">раз</div>
    <div class="item-2">два</div>
    <div class="item-3">
      <Bakery-Table :noEditTable="true"></Bakery-Table>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import BakeryTable from "components/Bakery/BakeryTable.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "FindTable",
  components: { BakeryTable },
  props: {
    maxBodyHeight: String,
  },
  emits: ["update:filter"],
  setup(props) {
    return {};
  },
});
</script>
<style lang="scss" scoped>
.grid-main {
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 30% 30%;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
  }
  background-color: transparent;
  .item-1,
  .item-2,
  .item-3 {
    border-color: blue;
    background-color: aquamarine;
  }
}
</style>
