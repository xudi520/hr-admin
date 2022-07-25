<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click.native="
        roleDialogVisible = true;
        isEdit = false;
        from = {};
      "
    >
      新增角色
    </el-button>
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        label="角色名称"
        prop="name"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)">
            分配权限
          </el-button>
          <el-button type="text" @click="showRoleDialog(scope.row)">
            修改
          </el-button>
          <el-button type="text" @click="del(scope.row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 4, 6, 8]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <el-dialog title="分配权限" :visible.sync="dialogVisible">
      <!-- v-if="dialogVisible" 可以保证每次对话框关闭的时候 让tree销毁，在显示对话框的时候，看到的tree是一个新的el-terr -->
      <el-tree
        v-if="dialogVisible"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissions"
      >
        <!-- :default-checked-keys 默认勾选的节点的 key 的数组 -->
        <!-- node-key="id" 选不选中看这个id值 唯一 -->
      </el-tree>
      <span slot="footer">
        <el-button type="primary" @click="save"> 确 定 </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新增和编辑对话框 -->
    <el-dialog
      :title="isEdit ? '修改' : '新增'"
      :visible.sync="roleDialogVisible"
      @close="reset"
    >
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="onClick"> 确 定 </el-button>
        <el-button @click="roleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { assignPermission, getPermissions, getPermissionsById } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认页数
        pagesize: 4// 每页数据
      },
      roleList: [],
      total: null,
      dialogVisible: false,
      permissions: [],
      selectedPermissions: [],
      id: null,
      // 新增和编辑对话框
      roleDialogVisible: false,
      //
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () { this.getRoleList() },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      // console.log(res)
      this.roleList = res.rows // 每页数据
      this.total = res.total// 用于分页 total总数
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
      // console.log(`每页 ${pagesize} 条`)
    },
    handleCurrentChange (page) {
      this.paramsObj.page = page
      this.getRoleList()
      // console.log(`当前页: ${page}`)
    },
    // 删除
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = delRole(id)
        console.log(res)
        // 解决bug 删除最后一页的最后一项数据 就应该跑到上一项
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配权限
    async showRightDialog (id) {
      this.id = id
      const res = await getPermissions()
      console.log(res)
      // 分装的组件
      this.permissions = tranferListToTree(res, '0')
      // 根据角色id获取权限 获取当前的权限点
      const res1 = await getPermissionsById(id)
      console.log(res1)
      this.selectedPermissions = res1.permIds
      this.dialogVisible = true
    },
    async save () {
      // console.log(this.$refs.myTree.getCheckedKeys())
      // id  角色id
      // ids数组 权限id数组
      // getCheckedKeys()只能获取全选的东西
      // getHalfCheckedNodes() 获取半选
      const res = assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      console.log(res)
      this.dialogVisible = false
    },
    onClick () {
      // 二次校验 校验失败静止发送ajax
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        // console.log('发送ajax')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    // 导致的原因是v-model双向绑定
    // 解决再次打开 清空表单
    reset () {
      this.$refs.myForm.resetFields()
    },
    showRoleDialog (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      this.form = { ...row }// 浅拷贝
      // this.form = Object.assign({}, row) //浅拷贝
    }

  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
