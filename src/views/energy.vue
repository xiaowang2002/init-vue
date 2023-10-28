<template>
  <div>
    <!--  搜索  -->
    <!--    // 检测点名称、检测点地址、状态-->
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item label="检测点名称" prop="monitoringPointsName">
        <el-input v-model="formInline.monitoringPointsName" placeholder="检测点名称"></el-input>
      </el-form-item>
      <el-form-item label="检测点地址" prop="monitoringPointsAddress">
        <el-input v-model="formInline.monitoringPointsAddress" placeholder="检测点地址"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formInline.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetForm('formInline')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleCreate">新建</el-button>

    <!--  数据列表  -->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号" width="180"/>
      <el-table-column prop="monitoringPointsName" label="检测点名称"/>
      <el-table-column prop="monitoringPointsAddress" label="检测点地址"/>
      <el-table-column prop="realTimePower" label="实时功率"/>
      <el-table-column prop="realTimeVolt" label="实时电压"/>
      <el-table-column label="状态" prop="status">
        <!--        三目运算符-->
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '正常' : '挂起' }}
        </template>
      </el-table-column>
      <el-table-column prop="reportTime" label="上报时间"/>
      <el-table-column prop="mark" label="备注"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <!-- el-form 难点 -->
      <el-form ref="form" :rules="formRules" :model="form" label-width="100px">
        <el-form-item label="检测点名称" prop="monitoringPointsName">
          <el-input v-model="form.monitoringPointsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="检测点地址" prop="monitoringPointsAddress">
          <el-input v-model="form.monitoringPointsAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实时功率" prop="realTimePower">
          <el-input v-model="form.realTimePower" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实时电压" prop="realTimeVolt">
          <el-input v-model="form.realTimeVolt" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.mark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// request 是 axios 的实例
import request from '@/utils/request'

export default {
  data() {
    return {
      options: [{
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '挂起'
      }],
      tableData: [], // ajax api .jar
      dialogFormVisible: false,
      form: {
        monitoringPointsName: '',
        monitoringPointsAddress: '',
        realTimePower: '',
        realTimeVolt: '',
        status: '',
        mark: ''
      },
      formRules: {
        monitoringPointsName: [
          { required: true, message: '请输入monitoringPointsName', trigger: 'blur' }
        ],
        monitoringPointsAddress: [
          { required: true, message: '请输入monitoringPointsName', trigger: 'blur' }
        ],
        realTimePower: [
          { required: true, message: '请输入monitoringPointsName', trigger: 'blur' }
        ],
        realTimeVolt: [
          { required: true, message: '请输入monitoringPointsName', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入monitoringPointsName', trigger: 'change' }
        ]
      },
      dialogTitle: '',
      // 搜索
      formInline: {
        monitoringPointsAddress: '',
        monitoringPointsName: '',
        status: ''
      }
    }
  },
  created() {
    //
    this.getList()
  },
  methods: {
    getList() {
      // ajax   接口地址、请求方式
      request({
        method: 'GET',
        url: '/dc/prewarning/list'
      }).then(res => {
        console.log(res.rows)
        this.tableData = res.rows
      }).catch(e => {

      }).finally(() => {

      })
    },
    handleEdit(row) {
      // console.log(row.id)
      // 回填数据
      request({
        url: `/dc/prewarning/${row.id}`
      }).then(res => {
        this.form = res.data
      })

      this.dialogTitle = '修改能效检测点'
      this.dialogFormVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // edit
          if (this.form.id) {// edit
            request({
              method: 'PUT',
              url: '/dc/prewarning',
              data: this.form
            }).then(res => {
              // 关闭弹窗
              this.dialogFormVisible = false
              // 刷新数据
              this.getList()
            })
          } else {// add
            request({
              method: 'POST',
              url: '/dc/prewarning',
              data: this.form
            }).then(res => {
              // 关闭弹窗
              this.dialogFormVisible = false
              // 刷新数据
              this.getList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCreate() {
      // 重置弹窗表单数据
      this.form = {
        monitoringPointsName: '',
        monitoringPointsAddress: '',
        realTimePower: '',
        realTimeVolt: '',
        status: '',
        mark: ''
      }
      //
      this.dialogTitle = '添加能效检测点'
      this.dialogFormVisible = true
    },
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          method: 'DELETE',
          url: '/dc/prewarning/' + id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 搜索
    onSubmit() {
      request({
        url: '/dc/prewarning/list',
        params: this.formInline
      }).then(res => {
        this.tableData = res.rows
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetForm()
      this.formInline.monitoringPointsName = ''
      this.formInline.monitoringPointsAddress = ''
      this.formInline.status = ''
      this.onSubmit()
    }
  }
}
</script>
