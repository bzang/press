<template>
  <input
    :value="value"
    :v-model="normalizedKeyPath"
    type="hidden">
</template>

<script>
import {normalizeKeyPath} from '../../lib/vue-helpers';

/* eslint-disable sort-keys */
/**
 * PRESS component for providing additional data to the client-side data model.
 *
 * PRESS automatically adds anything with a `[name]` attribute to the
 * client-side data model (which effectively means "form fields") but some
 * client-side logic may need data that wouldn't be in the form itself. The
 * `<press-bind>` component accepts a value and a name at which to mount that
 * value into the data model. This element's implementation explicitly discards
 * the `name` attribute in the final render so that it doesn't get sent as part
 * of a form submisssion.
 */
export default {
  props: {
    name: {
      required: true,
      type: String
    },
    value: {
      /** @returns {string|null} */
      default() {
        return null;
      },
      type: String
    }
  },
  computed: {
    /** @returns {string} */
    normalizedKeyPath() {
      return normalizeKeyPath(this.name);
    }
  }
};
/* eslint-enable sort-keys */
</script>

<style scoped>
</style>
