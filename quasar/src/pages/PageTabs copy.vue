<template>
  <q-page :style-fn="panelFnHeight">
    <q-splitter v-model="splitterModel" :style="{ height: heightMax }">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-blue">
          <q-tab name="users" icon="emoji_people" label="Пользователи" />
          <q-tab name="bake" icon="cake" label="Пекарни" />
          <q-tab name="nomencl" icon="library_books" label="Номенклатура" />
          <q-tab name="kontr" icon="person_remove" label="Контрагенты" />
          <q-tab name="catalogs" icon="library_books" label="Справочники" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="users">
            <page-tab-users></page-tab-users>
          </q-tab-panel>

          <q-tab-panel name="bake">
            <page-tab-bakehouses></page-tab-bakehouses>
          </q-tab-panel>

          <q-tab-panel name="nomencl" :style="panelHeight">
            <nomenclature></nomenclature>
          </q-tab-panel>
          <q-tab-panel name="kontr">
            <page-tab-partners></page-tab-partners>
          </q-tab-panel>
          <q-tab-panel name="catalogs">
            <page-tab-catalogs></page-tab-catalogs>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import { ref } from "vue";
import PageTabUsers from "pages/PageTabUsers.vue";
import PageTabBakehouses from "pages/PageTabBakehouses.vue";
import Nomenclature from "components/Nomenclature.vue";
//import PageTabNomenclature from "pages/PageTabNomenclature.vue";
import PageTabPartners from "pages/PageTabPartners.vue";
import PageTabCatalogs from "pages/PageTabCatalogs.vue";
export default {
  components: {
    PageTabUsers,
    PageTabBakehouses,
    Nomenclature,
    PageTabPartners,
    PageTabCatalogs,
  },
  setup() {
    const heightMax = ref("");
    const panelHeight = ref({});
    function panelFnHeight(offset) {
      let height = `calc(100vh - ${offset}px)`;
      console.log("ну ка ", offset);
      heightMax.value = height;
      panelHeight.value = { minHeight: height, maxHeight: height };
      return { minHeight: height, maxHeight: height };
      //return this.$store.state.common.panelHeight;
    }
    return {
      heightMax,
      panelHeight,
      panelFnHeight,
      tab: ref("users"),
      splitterModel: ref(10),
    };
  },
};
</script>
