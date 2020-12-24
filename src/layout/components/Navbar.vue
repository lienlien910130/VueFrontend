<template>
  <div class="navbar">
    <div class="left-menu">
      <router-link to="/">
         <svg-icon  icon-class="indexlogo"
          style="width:200px;height:90px" />       
      </router-link>
    </div>

    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <Select 
        class="select right-menu-item"
        v-bind="selectAttrs" 
        v-on:handleSelect="handleSelect">
        </Select>

        <Screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown 
        class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <svg-icon icon-class="user" style="font-size:25px"/>
            <span style="margin-left:3px">{{ name }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                首頁
              </el-dropdown-item>
            </router-link>
            <router-link to="/membersetting">
              <el-dropdown-item>
                設定
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <el-row :gutter="20">
      <el-col :xs="2" :sm="3" :md="4" :lg="4" :xl="4">
        <div class="grid-content">
          <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        </div>
      </el-col>
      
      <el-col :xs="20" :sm="18" :md="16" :lg="16" :xl="16">
        <div class="grid-content">
          <div class="center-menu">
             <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" :offset="2" class="text-center">
              <router-link class="pan-btn blue-btn" to="/">
                首頁
              </router-link>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="text-center vertical">
              <router-link class="pan-btn blue-btn" to="/equipment/fire">
                設備管理
              </router-link>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="text-center">
              <router-link class="pan-btn blue-btn" to="/normal/basic">
                平時管理
              </router-link>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="text-center">
              <router-link class="pan-btn blue-btn" to="/analysis/fire">
                歷史分析
              </router-link>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="text-center">
              <router-link class="pan-btn blue-btn" to="/emergency/aaa">
                緊急應變
              </router-link>
            </el-col>     
          </div>
        </div>
      </el-col>
      <el-col :xs="2" :sm="3" :md="4" :lg="4" :xl="4">
        <div class="grid-content">
          <div class="right-menu">
            <Select class="select"
              v-bind="selectAttrs" 
              v-on="selectEvent"></Select>

            <svg-icon  icon-class="user" />
            
            <el-dropdown 
            class="avatar-container" trigger="click">
              <div class="avatar-wrapper">
                <span>{{ name }}</span>
              </div>
              <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <router-link to="/">
                  <el-dropdown-item>
                    首頁
                  </el-dropdown-item>
                </router-link>
                <router-link to="/membersetting">
                  <el-dropdown-item>
                    設定
                  </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided @click.native="logout">
                  <span style="display:block;">登出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    Select: () => import('@/components/Select/index.vue'),
    Breadcrumb: () => import('@/components/Breadcrumb'),
    Hamburger: () => import('@/components/Hamburger'),
    Screenfull: () => import('@/components/Screenfull')
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'account',
      'name',
      'id',
      'device'
    ]),
    selectAttrs() {
      return {
        selectData: this.selectData,
        title:'Building'
      }
    }
  },
  async mounted() {
      await this.getBuilding()
  },
  data() {
    return {
      selectData:[],
      options:[]
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async getBuilding() {
      await this.$api.building.apiGetBuilding().then(response=>{
        this.$store.dispatch('building/setbuildingid',response.result[0].id)
        response.result.forEach(item => {
              let _array = { 
                  id : item.id, 
                  label: item.buildingName, 
                  value: item.id,
                  up: item.floorsOfAboveGround,
                  down: item.floorsOfUnderground
              }
              this.options.push(_array)  
            })
        this.selectData = this.options
      })
    },
    handleSelect(content){
      this.$store.dispatch('building/setbuildingid',content[0].id)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 90px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background-image:url("../../assets/image/navbarimg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .breadcrumb-container {
    float: left;
  }
  .left-menu {
    
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;
    
    &:focus {
      outline: none;
    }
    .select { 
      width: 180px;
      margin-right: 10px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
      }
    }

    .el-dropdown{
      font-size: 18px;
      color: black;
    }
  }
}

  .el-row {
    //margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .grid-content {
    width: 100%;
    height: 100%;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
