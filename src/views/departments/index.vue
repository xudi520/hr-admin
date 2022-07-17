<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        v-loading="isLoading"
        style="min-height: 800px"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TerrItem
              :node="titleObj"
              @delDepartment="getDepartmenstList"
            ></TerrItem>
            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <TerrItem
                  :node="scope.node"
                  @delDepartment="getDepartmenstList"
                ></TerrItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartmenstList } from '@/api/departments'
import TerrItem from './components/TerrItem.vue'
export default {
  filters: {},
  components: { TerrItem },
  data () {
    return {
      // 处理好的depts
      data: [],
      titleObj: {},
      isLoading: true
    }
  },
  computed: {
  },
  watch: {},
  created () {
    this.getDepartmenstList()
  },
  methods: {
    async getDepartmenstList () {
      const res = await getDepartmenstList()
      // console.log(res)
      // 数据不能直接使用 得自己加工 递归处理
      function tranferListToTerr (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTerr(list, item.id)
          }
        })
        return list1
      }
      this.data = tranferListToTerr(res.depts, '')
      // console.log(res1)
      // this.data = res1
      // 标题
      this.titleObj = res.depts[0]
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
