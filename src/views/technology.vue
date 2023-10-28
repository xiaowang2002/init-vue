<template>
  <div>
    <!--  搜索  -->
    <!--    // 检测点名称、检测点地址、状态-->
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item label="工艺名称" prop="projectName">
        <el-input v-model="formInline.technologyName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
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
      <el-table-column prop="technologyName" label="工艺名称"/>
      <el-table-column prop="productName" label="产品"/>
      <el-table-column prop="productModel" label="型号"/>
      <el-table-column prop="productSku" label="规格"/>
      <el-table-column prop="productUnit" label="单位"/>
      <el-table-column prop="unitPowerConsumption" label="单位耗电量"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[5, 10, 30, 50,100]"
      :page-size="pageSize"
      layout="total, sizes,prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <!-- el-form 难点 -->
      <el-form ref="form" :rules="formRules" :model="form" label-width="100px">
        <el-form-item label="产品">
          <el-select v-model="form.productName" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺名称" prop="technologyName" :required="true">
          <el-input v-model="form.technologyName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位耗电量" prop="unitPowerConsumption" :required="true">
          <el-input v-model="form.unitPowerConsumption" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工艺描述" prop="technologyDescribe">
          <el-input v-model="form.technologyDescribe" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle2" :visible.sync="dialogFormVisible2">
      <!-- el-form 难点 -->
      <el-form ref="form" :rules="formRules" :model="form" label-width="100px">
        <el-form-item label="产品" prop="productName" :required="true">
          <el-input v-model="form.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工艺名称" prop="technologyName" :required="true">
          <el-input v-model="form.technologyName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位耗电量" prop="unitPowerConsumption" :required="true">
          <el-input v-model="form.unitPowerConsumption" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工艺描述" prop="technologyDescribe">
          <el-input v-model="form.technologyDescribe" autocomplete="off"></el-input>
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
      currentPage4: 1,
      pageSize: 5,
      total: 400,
      value1: null,
      options: [],
      value: '',
      tableData: [], // ajax api .jar
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        id: '',
        productId: '',
        productName: '',
        technologyName: '',
        unitPowerConsumption: '',
        remark: '',
        technologyDescribe: ''
      },
      formRules: {
        projectName: [
          { required: true, message: '请输入projectName', trigger: 'blur' }
        ],
        projectHeader: [
          { required: true, message: '请输入projectHeader', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请输入startDate', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请输入endDate', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入status', trigger: 'change' }
        ]
      },
      dialogTitle: '',
      // 搜索
      formInline: {
        technologyName: ''
      },
      dialogTitle2: ''
    }
  },
  created() {
    //
    this.getList()
    this.fetchOptions()
  },
  methods: {
    fetchOptions() {
      request({
        method: 'GET',
        url: 'http://localhost:9090/product/list'
      }).then(res => {
        console.log(res.data)
        this.options = res.data.map(item => {
          return {
            value: item.id,
            label: item.productName
          }
        })
      }).catch(e => {
        // Handle error
        console.error('Failed to fetch options:', e)
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage4 = val
      this.getList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currentPage4 = 1
      this.getList()
    },
    getList() {
      this.fetchOptions()
      // ajax   接口地址、请求方式
      request({
        method: 'GET',
        url: '/mes/technology/list',
        params: {
          'pageNum': this.currentPage4, 'pageSize': this.pageSize,
          'technologyName': this.formInline.technologyName
        }
      }).then(res => {
        console.log(res.data)
        this.tableData = res.data
        this.total = res.total
      }).catch(e => {

      }).finally(() => {

      })
    },
    handleEdit(row) {
      console.log(row)
      // console.log(row.id)
      // 回填数据
      request({
        url: `/mes/technology/${row.id}`
      }).then(res => {
        console.log('res:' + res.data)
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
            if (Number.isInteger(this.form.productName)) {
              this.form.productId = this.form.productName
            }
            request({
              method: 'PUT',
              url: '/mes/technology',
              data: this.form
            }).then(res => {
              // 关闭弹窗
              this.dialogFormVisible = false
              // 刷新数据
              this.getList()
            })
          } else {// add
            this.form.productId = this.form.productName
            request({
              method: 'POST',
              url: '/mes/technology',
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
          url: '/mes/technology/' + id
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
        url: '/mes/technology/list',
        params: this.formInline
      }).then(res => {
        this.tableData = res.data
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetForm()
      this.formInline.technologyName = ''
      this.getList()
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
