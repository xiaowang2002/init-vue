<template>
  <div>
    <el-button type="primary" @click="add()" style="margin: 5px;">选择</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" width="180">
      </el-table-column>
      <el-table-column prop="product" label="产品">
      </el-table-column>
      <el-table-column prop="productionLine" label="生产线名称">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="del(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="70%">
      <el-row>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="生产线名称" prop="productionLine">
            <el-input v-model="ruleForm.productionLine"></el-input>
          </el-form-item>
          <el-form-item label="产品" prop="product">
            <el-input v-model="ruleForm.product"></el-input>
          </el-form-item>
          <el-form-item label="产品型号">
            <el-input v-model="ruleForm.productModel" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="产品规格">
            <el-input v-model="ruleForm.productSpec" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="product">
            <el-input v-model="ruleForm.description"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="getWl()" v-if="flag">选择</el-button>
      </el-row>
      <el-row v-if="flag">
        <el-divider></el-divider>
        <h3 style="text-align: center; margin-top: -10px;">产品建模明细信息</h3>
        <el-button type="primary" @click="addFmd()">新增</el-button>
        <el-table :data="factoryModelingDetails" border style="width: 100%;margin-top: 10px;">
          <el-table-column type="index" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="equipment" label="设备">
            <template slot-scope="{row}">
              <el-input v-model="row.equipment"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编码">
            <template slot-scope="{row}">
              <el-input v-model="row.code"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="型号">
            <template slot-scope="{row}">
              <el-input v-model="row.model"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="productionDate" label="生产日期">
            <template slot-scope="{row}">
              <el-input v-model="row.productionDate"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="batchNumber" label="生产批号">
            <template slot-scope="{row}">
              <el-input v-model="row.batchNumber"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="manufacturer" label="制造商">
            <template slot-scope="{row}">
              <el-input v-model="row.manufacturer"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row}">
              <el-button type="danger" icon="el-icon-delete" @click="FmdDel(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 对话框物料 -->
    <el-dialog title="选择物料档案" :visible.sync="dialogVisibleWL" width="80%">
      <el-row :gutter="20">
        <el-col :span="3">
          <div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </el-col>
        <el-col style="padding-left: 20px;" :span="21">
          <el-table :data="materialarchives" border style="width: 100%">
            <el-table-column prop="id" label="编号">
            </el-table-column>
            <el-table-column prop="materialCode" label="物料编码">
            </el-table-column>
            <el-table-column prop="materialName" label="物料名称">
            </el-table-column>
            <el-table-column prop="materialModel" label="型号">
            </el-table-column>
            <el-table-column prop="materialSpec" label="规格">
            </el-table-column>
            <el-table-column prop="materialUnit" label="单位">
            </el-table-column>
            <el-table-column prop="materialPrice" label="单价">
            </el-table-column>
            <el-table-column prop="materialRemarks" label="备注">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="primary" @click="xz(row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleWL = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleWL = false">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryApi, addApi, delApi, updateApi, addFmdApi, delFmdApi, queryClsApi } from '@/api/main/FactoryModeling'

export default {
  data() {
    return {
      materialarchivesSum: [],
      isId: 0,
      title: '',
      tableData: [],
      dialogVisible: false,
      dialogVisibleWL: false,
      flag: true,
      factoryModelingDetails: [],
      addfactoryModelingDetails: [],
      materialarchives: null,
      ruleForm: {
        product: '',
        productionLine: '',
        productModel: '',
        productSpec: '',
        description: ''
      },
      fmdForm: {
        batchNumber: '',
        code: '',
        equipment: '',
        fid: '',
        manufacturer: '',
        model: '',
        productionDate: ''
      },
      rules: {
        product: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productionLine: [
          { required: true, message: '请输入生产线名称', trigger: 'blur' }
        ]
      },
      data: [{
        label: '一级目录',
        children: [{
          label: '零件'
        },
          {
            label: '成品'
          }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await queryApi()
      if (res.code > 0) {
        this.tableData = res.data
      }
      const { data: cls } = await queryClsApi()
      this.materialarchivesSum = cls.data
    },
    update(row) {
      this.isId = row.id
      console.log(this.isId)
      this.factoryModelingDetails = []
      this.flag = true
      this.title = '修改工厂建模'
      this.ruleForm = {
        id: row.id,
        product: row.product,
        productionLine: row.productionLine,
        productModel: row.productModel,
        productSpec: row.productSpec,
        description: row.description
      }
      this.factoryModelingDetails = row.factoryModeingDetails
      this.dialogVisible = true
    },
    async del(row) {
      const { data: res } = await delApi(row.id)
      if (res.code > 0) {
        this.$message.error('删除成功')
        this.getList()
      }
    },
    getWl() {
      this.dialogVisibleWL = true
    },
    handleNodeClick(data) {
      if (data.label != '一级目录') {
        const res = this.materialarchivesSum.filter((item) => {
          return item.name == data.label
        })
        this.materialarchives = res[0].materialarchives
      }
    },
    add() {
      this.ruleForm = {
        product: '',
        productionLine: '',
        productModel: '',
        productSpec: '',
        description: ''
      }
      this.flag = false
      this.title = '添加工厂建模'
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.flag) {
            const arr = this.factoryModelingDetails.filter((item) => {
              return !item.id
            })
            if (arr.length > 0) {
              const res = await addFmdApi(arr)
              await updateApi(this.ruleForm)
              this.$message.success('修改成功')
              this.dialogVisible = false
              this.getList()
            } else {
              this.dialogVisible = false
              await updateApi(this.ruleForm)
              this.$message.success('修改成功')
              this.getList()
            }
          } else {
            const { data: res } = await addApi(this.ruleForm)
            if (res.code > 0) {
              this.getList()
              this.dialogVisible = false
              this.$message.success('新增成功')
            }
          }
        } else {
          return false
        }
      })
    },
    addFmd() {
      this.factoryModelingDetails.push({
        batchNumber: '',
        code: '',
        equipment: '',
        factoryModeling: {
          id: this.isId
        },
        manufacturer: '',
        model: '',
        productionDate: ''
      })
    },
    async FmdDel(row) {
      console.log(row)
      const res = await delFmdApi(row.id)
      if (res.code > 0) {
        this.getList()
        this.$message.error('删除成功')
      }
    },
    xz(row) {
      this.ruleForm.productModel = row.materialModel
      this.ruleForm.productSpec = row.materialSpec
      this.dialogVisibleWL = false
    }
  }
}
</script>

<style></style>
