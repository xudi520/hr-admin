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
            <!-- 下拉菜单 element -->
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
      title="新增部门"
      :model="addDepartmentForm"
      :rules="rules"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
    >
      <!--  @click.native.stop 阻止冒泡 -->
      <el-form ref="ruleForm" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="name">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="name">
          <el-input placeholder="请选择负责人"></el-input>
        </el-form-item>
        <el-form-item label="部门介绍" prop="name">
          <el-input type="textarea" placeholder="1-300个字符"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        intorduce: ''// 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async onCommend (key) {
      if (key === 'a') {
        // console.log('添加')
        this.addDialogVisible = true
      } else if (key === 'b') {
        console.log('编辑')
      } else {
        // console.log('删除')
        try {
          await this.$confirm('确定要删除吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          // console.log(res)
          this.$emit('delDepartment')
        } catch (err) {
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
