<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1数据">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <!--
            $router 用来实现路由切换的 相当于VueRouter实例 beforEach afterEach
            $route 获取路由相关的参数 query params 指的是当前路由
           -->
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="addEmployeeVisble = true"
          >
            新增员工
          </el-button>
        </template>
      </PageTool>
      <el-card style="margin-top: 20px">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 40px"
                @click="showQrDialog(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column> -->
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column> -->
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="340px" align="center">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="$router.push('/employee/detail/' + scope.row.id)"
                >查看</el-button
              >
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRoleDialog(scope.row.id)">
                角色
              </el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 角色 -->
    <el-dialog title="分配角色" :visible.sync="roleVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增员工 -->
    <el-dialog
      title="新增员工"
      :visible.sync="addEmployeeVisble"
      center
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <el-tree
            v-if="deparmentList.length > 0"
            default-expand-all
            :data="deparmentList"
            :props="{ label: 'name' }"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmployeeVisble = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 图片二维码 -->
    <el-dialog title="图片二维码" :visible.sync="qrCodeVisible" center>
      <canvas ref="canvas"></canvas>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { getDepartmenstList } from '@/api/departments'
import { validMobile } from '@/utils/validate'
import { getEmployee, assignRoles } from '@/api/employee'
import employees from '@/constant/employees.js'
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
export default {
  name: 'Employee',
  filters: {
    formatFormType (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === id - 0).value
      } else {
        return '未知'
      }
    }
  },
  components: {},
  data () {
    const validateMobile = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机号和格式不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 9
      },
      employees: [],
      total: null,
      roleVisible: false,
      // 选中状态
      checkList: [],
      // 数据
      roleList: [],
      id: null,
      // 新增员工
      addEmployeeVisble: false,
      // 表单
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 表单校验
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      hireType: employees.hireType,
      // 树结构数据
      deparmentList: [],
      // 图片二维码
      qrCodeVisible: false
    }
  },
  computed: {

  },
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      // console.log(this.paramsObj)
      const res = await getEmployee(this.paramsObj)
      // console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    formatterEmployee (row, column, cellValue, index) {
      var obj = employees.hireType.find(item => item.id === cellValue)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue).value
      } else {
        return '未知'
      }
    },
    // excel导出
    async exportExcel () {
      // 1.拿到要导出的数据
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      // 删除多余 不能打印的数据
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      // 2.把列表数据进行加工处理变成二维数组
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => headers[item])
      // 包比较大 点击按钮才会导入
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['编号', '姓名']
        // const data = [[1, '张三'], [2, '李四']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 复杂表头
    exportExcel1 () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    async showRoleDialog (id) {
      this.id = id
      const { rows } = await getRoleList({ page: 1, pagesize: 999 })
      this.roleList = rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
      this.roleVisible = true
    },
    // 给员工分配权限
    async assignRoles () {
      const res = await assignRoles({ id: this.id, roleIds: this.checkList })
      console.log(res)
      this.roleVisible = false
    },
    // 清空表单解决再次打开有数据的bug
    handleClose () {
      this.$refs.employeeRef.resetFields()
      this.deparmentList = []
    },
    //
    async showDepartment () {
      const res = await getDepartmenstList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.deparmentList = tranferListToTree(res.depts, '')
      // console.log(data)
    },
    handleNodeClick (obj) {
      // 把当前节点的值负值给表单输入框
      this.employeeForm.departmentName = obj.name
      this.deparmentList = []// 关闭tree
    },
    // 图片二维码
    showQrDialog (img) {
      this.qrCodeVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, img, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.el-alert {
  display: inline;
  width: unset;
}
.cell {
  width: 25px;
}
</style>
