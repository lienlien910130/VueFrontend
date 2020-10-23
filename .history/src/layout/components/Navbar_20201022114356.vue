<template>
  <div class="navbar">
    <el-row :gutter="20">
      <el-col :xs="2" :sm="3" :md="4" :lg="4" :xl="4">
        <div class="grid-content">
          <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        </div>
      </el-col>
      
      <!-- <el-col :xs="20" :sm="18" :md="16" :lg="16" :xl="16">
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
      </el-col> -->
      <el-col :xs="2" :sm="3" :md="4" :lg="4" :xl="4" style="float:right;">
        <div class="grid-content">
          <div class="right-menu">
            <Select class="select"
              v-bind="selectAttrs" 
              v-on="selectEvent"></Select>

            <svg-icon  icon-class="user" />
            
            <el-dropdown 
            class="avatar-container" trigger="click">
              <div class="avatar-wrapper">
                <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
                <!-- <i class="el-icon-caret-bottom" /> -->
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
    </el-row>
    <!-- <breadcrumb class="breadcrumb-container" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getbuilding } from '@/api/building'
import { apiGetBuilding } from '@/api/build'

export default {
  components: {
    Select: () => import('@/components/Select/index.vue'),
    Breadcrumb: () => import('@/components/Breadcrumb'),
    Hamburger: () => import('@/components/Hamburger')
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'account',
      'name',
      'id'
    ]),
    selectAttrs() {
      return {
        selectData: this.selectData,
        title:'Building'
      }
    },
    selectEvent() {
      return {
        subChangeOption: this.handleSelectOption
      }
    },
  },
  mounted() {
      this.getBuilding()
  },
  data() {
    return {
      selectData:[],
      options:[]
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getBuilding() {
      console.log('getBuilding')
      apiGetBuilding({ uid: this.id }).then(response=>{
        console.log('getBuilding=>'+JSON.stringify(response))
      })
      // getbuilding(this.id).then(response => {
      //     response.result.forEach(item => {
      //         let _array = { 
      //             id : item.id, 
      //             label: item.buildingName, 
      //             value: item.id,
      //             up: item.floorsOfAboveGround,
      //             down: item.floorsOfUnderground
      //         }
      //         this.options.push(_array)  
      //       })
      //         this.selectData = this.options
      // })
    },
    handleSelectOption(content){
      this.$store.dispatch('building/setbuildingid',content.id)
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .select { 
      width: 200px;
      margin-bottom: 20px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
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
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
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
    height: 100%;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
