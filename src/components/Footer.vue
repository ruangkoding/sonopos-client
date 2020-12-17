<template>
  <footer class="c-footer bg-dark">
    <span class="text-light" style="margin-left: 10%;" v-if="mobile">
      <strong>PT Sosro Retno Copyright &copy; 2020</strong>
    </span>
    <span class="text-light" v-else>
      <strong>PT Sosro Retno Copyright &copy; 2020</strong>
    </span>
  </footer>
</template>
<script>

import { isMobile } from 'mobile-device-detect'
export default {
  data() {
    return {
      mobile: false
    }
  },
  mounted() {
    this.isLoading = false
    if (isMobile) {
      this.mobile = true
    }
  },
}
</script>
