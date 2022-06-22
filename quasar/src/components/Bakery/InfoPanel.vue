<template>
  <q-dialog
    @before-show="beforeShow"
    :model-value="infoShow"
    @update:model-value="$emit('update:infoShow', $event)"
    class="info-dialog"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ infoTitle }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="info-grid">
          <div
            class="info-item"
            v-for="(val, key, idx) in dataItog"
            :key="key"
            :test="idx"
          >
            {{ val }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Да" color="primary" v-close-popup />
        <q-btn flat label="Нет" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "InfoPanel",
  components: {},
  props: ["infoShow", "infoData", "infoDataIdx", "infoTitle"],
  emits: ["update:infoShow"],
  setup(props) {
    const dataItog = ref([]);
    function beforeShow() {
      dataItog.value = [];
      console.log(props.infoDataIdx, props);
      props.infoDataIdx.forEach((el) => {
        let entries = Object.entries(el);
        for (const [key, val] of entries) {
          console.log(key, val);
          dataItog.value.push(val);
          dataItog.value.push(props?.infoData[key]);
        }
      });
    }

    return { beforeShow, dataItog };
  },
});
</script>
<style lang="scss" scoped>
.info-dialog {
  width: 300px;
  max-width: 98vw;
}
.info-grid {
  padding: 6px;
  display: grid;
  grid-column-gap: 6px;
  grid-template-columns: 50% 50%;
  .info-item {
    font-size: 15px;
    // нечетные
    &:nth-child(odd) {
      text-align: right;
      font-weight: bold;
    }
  }
}
</style>
