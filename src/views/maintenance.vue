<template>
  <div>
    <!--  搜索  -->
    <!--    // 检测点名称、检测点地址、状态-->
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item label="项目名" prop="projectName">
        <el-input v-model="formInline.projectName" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="formInline.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="formInline.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
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
      <el-table-column prop="projectName" label="项目名"/>
      <el-table-column prop="introduce" label="项目介绍">
        <template slot-scope="scope">
          <el-image :src="`http://localhost:9090${scope.row.introduce}`" alt="项目介绍"
                    style="max-width: 100%;"
          />
        </template>

      </el-table-column>
      <el-table-column prop="projectHeader" label="负责人"/>
      <el-table-column prop="startDate" label="开始日期"/>
      <el-table-column prop="endDate" label="结束日期"/>
      <el-table-column label="项目状态">
        <!--        三目运算符-->
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? '正常' : '挂起' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <!-- el-form 难点 -->
      <el-form ref="form" :rules="formRules" :model="form" label-width="100px">
        <el-form-item label="项目名" prop="monitoringPointsName">
          <el-input v-model="form.projectName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="monitoringPointsAddress">
          <el-input v-model="form.projectHeader" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目介绍">
          <el-upload
            class="upload-demo"
            action="http://localhost:9090/common/upload"
            :headers="header"
            :on-success="fileUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
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
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      header: {
        Authorization: getToken()
      },
      fileList: [],
      value1: null,
      options: [{
        value: 1,
        label: '挂起'
      }, {
        value: 0,
        label: '正常'
      }],
      value: '',
      tableData: [], // ajax api .jar
      dialogFormVisible: false,
      form: {
        projectName: '',
        projectHeader: '',
        startDate: '',
        endDate: '',
        status: ''
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
        projectName: '',
        startDate: '',
        endDate: '',
        status: ''
      }
    }
  },
  created() {
    //
    this.getList()
  },
  methods: {
    fileUpload(file) {
      console.log(file)
      this.form.introduce = file.fileName
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getList() {
      // ajax   接口地址、请求方式
      request({
        method: 'GET',
        url: '/mes/maintenance/list'
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
        url: `/mes/maintenance/${row.id}`
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
          console.log(this.form)
          if (this.form.id) {// edit
            request({
              method: 'PUT',
              url: '/mes/maintenance',
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
              url: '/mes/maintenance',
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
          url: '/mes/maintenance/' + id
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
        url: '/mes/maintenance/list',
        params: this.formInline
      }).then(res => {
        this.tableData = res.rows
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetForm()
      this.formInline.projectName = ''
      this.formInline.startDate = ''
      this.formInline.endDate = ''
      this.formInline.status = ''
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
