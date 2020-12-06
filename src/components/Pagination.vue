<template>
  <transition name="fade">
    <div class="row">
      <!-- <div class="col-4">
                <span class="pagination">
                    Menampilkan {{ pagination.from }} sampai {{ pagination.to }} dari {{ pagination.total }} data
                </span>
            </div> -->
      <div class="col-12">
        <ul class="pagination justify-content-center">
          <li v-if="pagination.page === 1" class="page-item disabled">
            <a class="page-link">&laquo; Sebelumnya</a>
          </li>
          <li class="page-item" v-else>
            <a class="page-link" v-on:click="$emit('previous')"
              >&laquo; Sebelumnya</a
            >
          </li>
          <li
            v-if="pagination.page >= pagination.last"
            class="page-item disabled"
          >
            <a class="page-link">Selanjutnya &raquo;</a>
          </li>
          <li class="page-item" v-else>
            <a class="page-link" v-on:click="$emit('next')"
              >Selanjutnya &raquo;</a
            >
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['pagination'],
}
</script>
