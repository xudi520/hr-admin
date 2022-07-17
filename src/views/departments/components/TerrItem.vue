<template>
  <div style="width: 100vw">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element 事件 -->
            <el-dropdown @command="onCommend">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
      @close="handleAddClose"
    >
      <!--  @click.native.stop 阻止冒泡 -->
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentForm.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input
            v-model="addDepartmentForm.manager"
            placeholder="请选择负责人"
          ></el-input> -->
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
            placeholder="1-300个字符"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, addDepartment, getDepartmenstList, editDepartment } from '@/api/departments'
import { getSimpleUserList } from '@/api/user'
export default {
  filters: {},
  components: {

  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    // element ui自定义校验规则函数
    // rule代表当前校验规则
    // value要校验的数据
    // callback()事件的回调函数
    const validateName = async (rule, value, callback) => {
      // 拿到所有部门的数据
      const res = await getDepartmenstList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid// 把当前要编辑的部门父级的id找到然后根据这个id去找所有的兄弟元素
        // && item.id !== this.node.data.id 排除自己 因为自己可以和自己重名
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称不能重复')) : callback()
      } else {
        // 待筛选的所有子部门的pid值 三元是解决标题没有id的子集
        const id = this.node.data ? this.node.data.id : ''
        // filter 筛选子部门pid和当前部门id一样 说明就是它的子部门
        // some 看有没有符合条件 如果有一个相等返回true
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称不能重复')) : callback()
      }
    }
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: ''// 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          // change  value改变跟新
          { validator: validateName, trigger: 'blur' }
        ]
      },
      users: [],
      isEdit: false// 用来判断是添加还是编辑
    }
  },
  // 计算属性
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '添加部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommend (key) {
      // 只拿一次
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        // console.log('添加')
        // this.getSimpleUserList()
        this.addDialogVisible = true
        this.isEdit = false
      } else if (key === 'b') {
        // console.log('编辑')
        // this.getSimpleUserList()
        this.isEdit = true
        // 对话框
        this.addDialogVisible = true
        // 拿取数据放到对话框中  //{ ...this.node.data }浅拷贝
        this.addDepartmentForm = { ...this.node.data }
      } else {
        // console.log('删除')
        try {
          await this.$confirm('确定要删除吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')// 子向父传值，数据跟新要刷新tree
        } catch (err) {
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    // 获取简单列表
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      // console.log(res)
      this.users = res
    },
    handleAddClose () {
      this.$refs.addFormRef.resetFields()// 表单重置
    },
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentForm.children
        await editDepartment(this.addDepartmentForm)
      } else {
        // 在哪一项上面新增部门，这一项的id就是pid
        // this.addDepartmentForm.pid = this.node.data.id
        // 标题id在node下面 其他在node.data下面
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
        // const res = await addDepartment(this.addDepartmentForm)
        // console.log(res)
      }
      this.addDialogVisible = false
      this.$emit('delDepartment')// 子向父传值，数据跟新要刷新tree
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
