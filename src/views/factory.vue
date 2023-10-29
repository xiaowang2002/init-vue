<template>
  <div>
    <!--  搜索  -->
    <!--    // 检测点名称、检测点地址、状态-->
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item label="生产线名称" prop="projectName">
        <el-input v-model="formInline.productionLine" placeholder="请输入"></el-input>
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
      <el-table-column prop="product" label="产品"/>
      <el-table-column prop="productionLine" label="生产线名称"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">修改</el-button>
          <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <!-- el-form 难点 -->
      <el-form ref="form" :rules="formRules" :model="form" label-width="100px">
        <el-form-item label="生产线名称" prop="productionLine" :required="true" style="display: none">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产线名称" prop="productionLine" :required="true">
          <el-input v-model="form.productionLine" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品" prop="product" :required="true">
          <el-input v-model="form.product" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品型号" prop="productMode">
          <el-input
            placeholder="请输入内容"
            v-model="form.productMode"
            :disabled="true"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="产品规格" prop="specifications">
          <el-input
            placeholder="请输入内容"
            v-model="form.specifications"
            :disabled="true"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.factoryDescribe"
          >
          </el-input>

          <br/><br/>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </div>
      <el-button type="primary" @click="treeRender">选择</el-button>
      <hr/>
      <div style="text-align: center">
        产品建模信息
      </div>
      <el-button type="primary" @click="handleAddRow">新增</el-button>
      <el-table :data="form.factoryDeviceList" border style="width: 100%">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="设备" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deviceName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="编码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deviceCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="型号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deviceModel"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" width="150">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.produceDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="生产批号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.produceCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="制造商">
          <template slot-scope="scope">
            <el-input v-model="scope.row.manufacturer"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete1(scope.row.id,form.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="70%"
      :before-close="handleClose"
    >
      <el-row :gutter="20">
        <el-col :span="3">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col style="padding-left: 20px;" :span="21">
          <el-table :data="material" border style="width: 100%">
            <el-table-column prop="id" label="编号">
            </el-table-column>
            <el-table-column prop="materialCode" label="物料编码">
            </el-table-column>
            <el-table-column prop="materialName" label="物料名称">
            </el-table-column>
            <el-table-column prop="materialModel" label="型号">
            </el-table-column>
            <el-table-column prop="materialSpecifications" label="规格">
            </el-table-column>
            <el-table-column prop="materialUnit" label="单位">
            </el-table-column>
            <el-table-column prop="materialPrice" label="单价">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="primary" @click="choose(row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// request 是 axios 的实例
import request from '@/utils/request'

export default {
  data() {
    return {
      material: [],
      data: [{
        id: '',
        label: '一级 1',
        children: [{
          id: '',
          label: '二级 1-1'
        }]
      },
        {
          id: '',
          label: '一级 2',
          children: [{
            id: '',
            label: '二级 2-1'
          }]
        }],
      dialogVisible2: false,
      value1: null,
      options: [{
        value: '1',
        label: '挂起'
      }, {
        value: '0',
        label: '正常'
      }],
      value: '',
      tableData: [], // ajax api .jar
      dialogFormVisible: false,
      form: {
        id: '',
        productionLine: '',
        product: '',
        productMode: '',
        specifications: '',
        factoryDescribe: '',
        factoryDeviceList: []
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
        productionLine: ''
      }
    }
  },
  created() {
    //
    this.getList()
  },
  methods: {
    choose(data) {
      this.form.productMode = data.materialModel
      this.form.specifications = data.materialSpecifications
      this.dialogVisible2 = false
    },
    treeRender() {
      this.dialogVisible2 = true
      request({
        method: 'GET',
        url: '/materialClassify/tree'
      }).then(res => {
        console.log(res)
        console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          console.log(res[i].name)
          this.data[i].id = res[i].id
          this.data[i].label = res[i].name
          for (let j = 0; j < res[i].children.length; j++) {
            console.log(res[i].children[j].name)
            this.data[i].children[j].id = res[i].children[j].id
            this.data[i].children[j].label = res[i].children[j].name
          }
        }
      }).catch(e => {

      }).finally(() => {

      })
    },
    handleNodeClick(data) {
      const id = data.id
      request({
        method: 'GET',
        url: '/material/' + id
      }).then(res => {
        this.material = res.data
      }).catch(e => {

      }).finally(() => {

      })
    },
    handleAddRow() {
      const newRow = {
        id: '',
        deviceName: '',
        deviceCode: '',
        produceDate: '',
        produceCode: '',
        manufacturer: '',
        factoryId: ''
      }
      this.form.factoryDeviceList.push(newRow)
    },
    getList() {
      // ajax   接口地址、请求方式
      request({
        method: 'GET',
        url: '/mes/factory/list'
      }).then(res => {
        console.log(res.rows)
        this.tableData = res.data
      }).catch(e => {

      }).finally(() => {

      })
    },
    handleEdit(id) {
      // console.log(row.id)
      // 回填数据
      request({
        url: `/mes/factory/${id}`
      }).then(res => {
        console.log(res.data)
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
              url: '/mes/factory',
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
              url: '/mes/factory',
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
        mark: '',
        factoryDeviceList: []
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
          url: '/mes/factory/' + id
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
    handleDelete1(id, factoryId) {
      console.log('id:' + id + 'factoryId:' + factoryId)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          method: 'DELETE',
          url: '/mes/factoryDevice/' + id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.handleEdit(factoryId)
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
        url: '/mes/factory/list',
        params: this.formInline
      }).then(res => {
        this.tableData = res.data
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetForm()
      this.formInline.productionLine = ''
      this.onSubmit()
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
