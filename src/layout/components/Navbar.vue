<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
   
    <!-- <div class="left-menu">
      <router-link to="/">
         <svg-icon  icon-class="indexlogo"
          style="width:200px;height:90px" />       
      </router-link>
    </div> -->

    <div class="right-menu">
      <div class="avatar-container right-menu-item" style="margin-right:0px">
        <div class="avatar-wrapper">
          <svg-icon v-if="id == '1'" icon-class="edit" @click="handleTo" style="cursor:pointer"/>
        </div>
      </div>

      <Screenfull v-if="device!=='mobile'" id="screenfull" class="right-menu-item hover-effect" />

      <el-dropdown 
          class="avatar-container right-menu-item" trigger="click">
            <div class="avatar-wrapper">
              <i class="el-icon-office-building icon" />
              <span  v-if="device!=='mobile'" style="margin-left:3px">{{  buildingName  }}</span>
               <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu 
            slot="dropdown" 
            class="user-dropdown" 
            >
              <el-dropdown-item 
              v-for="item in selectData"
              :key="item.id"
              @click.native="handleSelect(item)">
                {{ item.buildingName }}
              </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

      <el-dropdown 
        class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <svg-icon icon-class="user" style="font-size:25px"/>
            <span v-if="device!=='mobile'" style="margin-left:3px">{{ name }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                首頁
              </el-dropdown-item>
            </router-link>
            <router-link v-if="buildingid !== undefined" to="/membersetting">
              <el-dropdown-item>
                設定
              </el-dropdown-item>
            </router-link>
            <router-link v-if="buildingid !== undefined" to="/building/files">
              <el-dropdown-item>
                檔案
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>

      <div v-if="device!=='mobile'" class="avatar-container right-menu-item" style="margin-right:0px">
          <div class="avatar-wrapper">
            <span class="timer">{{ date | formatDate }}</span>
          </div>
      </div>
      
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { formatTime } from '@/utils/index.js'
import Contactunit from '@/object/contactunit'
import Device from '@/object/device'
import Building from '@/object/building'
import Floors from '@/object/floors'
import Setting from '@/object/setting'
import User from '@/object/user'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Select: () => import('@/components/Select/index.vue'),
    Screenfull: () => import('@/components/Screenfull'),
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'account',
      'name',
      'id',
      'device',
      'buildingarray',
      'roles',
      'buildinginfo',
      'buildingid'
    ]),
    selectAttrs() {
      return {
        selectData: this.selectData,
        title:'Building'
      }
    }
  },
  async mounted() {
      let _this = this
	    this.timer = setInterval(() => { 
        _this.date = new Date()
      }, 1000)
  },
  filters: {
      formatDate:function (value) {
        return formatTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
      }
  },
  watch:{
      buildingarray:{
        handler:async function(){
          if(this.buildingid){
            var temp = this.buildingarray.filter((item,index)=>item.id == this.buildingid)
            if(temp.length == 0){
              this.$store.dispatch('building/resetBuildingid')
              location.reload()
            }
          }
          this.selectData = this.buildingarray
        },
        immediate:true
      },
      buildinginfo:{
        handler:async function(){
          this.buildingName = this.buildinginfo.length === 0 ? 
          '請選擇建築物' : this.buildinginfo[0].buildingName !== undefined ?
          this.buildinginfo[0].buildingName : ''
        },
        immediate:true
      },
  },
  beforeDestroy() { 
    if (this.timer) 
    { 
        clearInterval(this.timer)
    } 
  },
  data() {
    return {
      selectData:[],
      date: new Date(),
      buildingName:'請選擇建築物'
    }
  },
  methods: {
    handleTo(){
      this.$router.push('/building')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      console.log('logout')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async handleSelect(content){
       if(content !== undefined){
          this.$store.dispatch('building/setbuildingid',content.id)
          this.$store.dispatch('permission/setRoutes')
          this.$store.dispatch('building/setbuildinginfo',await Building.getInfo())
          this.$store.dispatch('building/setbuildingusers',await User.get())
          this.$store.dispatch('building/setbuildingoptions',await Setting.getAllOption())
          this.$store.dispatch('building/setbuildingcontactunit',await Contactunit.get())
          this.$store.dispatch('building/setbuildingdevices',await Device.get())
          this.$store.dispatch('building/setbuildingfloors',await Floors.get())
          this.$router.push('/')
          console.log('Navbardone')
          this.$store.dispatch('app/openSideBar')
       }
    }
  }
}
// background-image:url("../../assets/image/navbarimg.png");
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

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
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
</style>
