<template>
  <q-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    @before-show="$emit('beforeShow', $event)"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">title</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="scroll">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
        repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
        perferendis totam, ea at omnis vel numquam exercitationem aut, natus
        minima, porro labore.
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="Reserve" />
        <q-btn v-close-popup flat color="primary" round icon="event" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
// для  свойства componentBodyMenu у Table
export default defineComponent({
  name: "FormAddToGroup",
  components: {},
  props: {
    show: Boolean,
    dataDialog: Object,
  },
  emits: ["beforeShow", "update:show"],
  setup(props) {
    const title = ref("Добавить пекарню в группу");
    return { title };
  },
});
</script>
