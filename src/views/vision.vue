<template>
  <div class="container">
    <el-row class="chart-row">
      <div id="powerConsumption" style="width: 450px; height: 380px;" class="chart-item"></div>
      <div id="waterConsumption" style="width: 450px; height: 380px;" class="chart-item"></div>
      <div id="carbonEmissions" style="width: 450px; height: 380px;" class="chart-item"></div>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import request from '@/utils/request'

export default {
  data() {
    return {
      powerOption: {
        chartOption: {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
            {
              min: 0,
              max: 1000,
              name: 'Pressure1',
              type: 'gauge',
              detail: {
                formatter: '{value}'
              },
              data: [
                {
                  value: 50,
                  name: '耗电量'
                }
              ]
            }
          ]
        }
      },
      waterOption: {
        chartOption: {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
            {
              min: 0,
              max: 1000,
              name: 'Pressure1',
              type: 'gauge',
              detail: {
                formatter: '{value}'
              },
              data: [
                {
                  value: 50,
                  name: '耗水量'
                }
              ]
            }
          ]
        }
      },
      carbonEmissions: {
        chartOption: {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
            {
              min: 0,
              max: 1000,
              name: 'Pressure1',
              type: 'gauge',
              detail: {
                formatter: '{value}'
              },
              data: [
                {
                  value: 50,
                  name: '碳排放量'
                }
              ]
            }
          ]
        }
      },
      annularOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            sum: ''
          }
        ]
      }
    }
  },
  name: 'vision',
  mounted() {
    var chartDom1 = document.getElementById('powerConsumption')
    var chartDom2 = document.getElementById('waterConsumption')
    var chartDom3 = document.getElementById('carbonEmissions')
    var myChart1 = echarts.init(chartDom1)
    var myChart2 = echarts.init(chartDom2)
    var myChart3 = echarts.init(chartDom3)
    this.fetchOptions().then(rows => {
      let sum1 = 0
      let sum2 = 0
      let sum3 = 0
      let total = 0
      rows.forEach(row => {
        sum1 += row.powerConsumption
        sum2 += row.waterConsumption
        sum3 += row.carbonEmissions
      })
      this.powerOption.chartOption.series[0].data[0].value = sum1
      this.waterOption.chartOption.series[0].data[0].value = sum2
      this.carbonEmissions.chartOption.series[0].data[0].value = sum3
      myChart1.setOption(this.powerOption.chartOption)
      myChart2.setOption(this.waterOption.chartOption)
      myChart3.setOption(this.carbonEmissions.chartOption)
    }).catch(error => {
      console.error('Failed to fetch options:', error)
    })
  },
  methods: {
    fetchOptions() {
      return request({
        method: 'GET',
        url: 'http://localhost:9090/dv/energyConsumption/list'
      }).then(res => {
        return res.rows
      })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.chart-row {
  display: flex;
  justify-content: space-between;
}

.chart-item {
  width: 450px;
  height: 380px;
}
</style>
