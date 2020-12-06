<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <spinner :active="isLoading" />
            <form method="POST" v-on:submit.prevent="fetchData">
              <div class="row">
                <div class="form-group col-lg-4">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="fa fa-calendar"></i>
                      </span>
                    </div>
                    <date-picker
                      id="periode"
                      name="periode"
                      v-model="periode"
                      :config="options"
                      class="form-control"
                      placeholder="Periode"
                      autocomplete="off">
                    </date-picker>
                  </div>
                </div>
                <div class="form-group col-lg-4">
                  <button
                    type="submit"
                    :class="{ 'btn-block': mobile === true }"
                    class="btn btn-success">
                    <i class="fa fa-search"></i> Tampikan Data
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <spinner :active="isLoading" />
            <highcharts :options="sell_chart" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <spinner :active="isLoading" />
            <highcharts :options="buy_chart" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from './../services.js'
import { Chart } from 'highcharts-vue'

export default {
  data: function() {
    return {
      sell_chart: {},
      buy_chart: {},
      periode: '',
      year: '',
      year_chart: '',
      isLoading: false,
      attrs: [
        {
          key: 'today',
          highlight: true,
          dates: new Date(),
        },
      ],
      options: {
        format: 'YYYY-MM',
        viewMode: 'months',
        useCurrent: false,
        locale: 'id',
      },
    }
  },
  props: ['api', 'mobile'],
  components: {
    highcharts: Chart,
  },
  created() {
    this.isLoading = true
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      service
        .fetchData(this.$apiUrl + '/dashboard?year=' + this.periode)
        .then((response) => {
          this.isLoading = false
          this.year_chart = this.year
          this.generateBuyChart(response.buy_chart)
          this.generateSellChart(response.sell_chart)
        })
        .catch((error) => {
          this.isLoading = false
          console.log(error)
        })
    },
    generateSellChart(sell) {
      this.sell_chart = {
        chart: {
          type: 'column',
        },
        credits: {
          enabled: false,
        },
        title: {
          text: 'Statistik Penjualan',
        },
        yAxis: {
          min: 0,
          title: {
            text: null,
          },
          labels: {
            formatter: function() {
              if (this.value >= 1e6) {
                return (this.value / 1000000).toFixed(0) + ' Jt'
              }
              return this.value / 1000
            },
          },
        },
        xAxis: {
          categories: sell.timestamp,
        },
        series: [
          {
            name: 'Transaksi Penjualan',
            data: sell.data,
            color: '#6f42c1',
          },
        ],
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}:</td><td style="padding:0"><b>Rp.{point.y:,.0f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        legend: {
          enabled: false,
        },
      }
    },
    generateBuyChart(buy) {
      this.buy_chart = {
        chart: {
          type: 'line',
        },
        credits: {
          enabled: false,
        },
        title: {
          text: 'Statistik Pembelian',
        },
        yAxis: {
          min: 0,
          title: {
            text: null,
          },
          labels: {
            formatter: function() {
              if (this.value >= 1e6) {
                return (this.value / 1000000).toFixed(0) + ' Jt'
              }
              return this.value / 1000
            },
          },
        },
        xAxis: {
          categories: buy.timestamp,
        },
        series: [
          {
            name: 'Transaksi Pembelian',
            data: buy.data,
            color: '#6f42c1',
          },
        ],
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">Total:</td><td style="padding:0">Rp.{point.y:,.0f}</td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        legend: {
          enabled: false,
        },
      }
    },
  },
}
</script>
