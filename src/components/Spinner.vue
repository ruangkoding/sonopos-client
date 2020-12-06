<template>
  <div class="d-flex justify-content-center" v-if="active === true">
    <div
      class="spinner-border"
      role="status"
      style="width: 4rem; height: 4rem;"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['active'],
}
</script>
