// не подключено нигде
// https://router.vuejs.org/guide/advanced/composition-api.html#navigation-guards
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    // same as beforeRouteLeave option with no access to `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm(
        "Do you really want to leave? you have unsaved changes!"
      );
      // cancel the navigation and stay on the same page
      if (!answer) return false;
    });

    const userData = ref();

    // same as beforeRouteUpdate option with no access to `this`
    onBeforeRouteUpdate(async (to, from) => {
      // only fetch the user if the id changed as maybe only the query or the hash changed
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id);
      }
    });
  },
};
