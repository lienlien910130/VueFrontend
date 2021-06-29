<template>
  <div class="navbar">
    <div class="left-menu">
      <router-link to="/">
         <svg-icon  icon-class="indexlogo"
          style="width:200px;height:90px" />       
      </router-link>
    </div>

    <div class="right-menu">
      <el-row style="height:45px">
        <template v-if="device!=='mobile'">
        <el-dropdown 
          class="avatar-container right-menu-item" trigger="click">
            <div class="avatar-wrapper">
              <i class="el-icon-office-building icon" />
              <span style="margin-left:3px">{{  buildingName  }}</span>
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
        <i v-if="id == '1'" class="el-icon-circle-plus-outline icon" @click="handleTo"></i>
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
      </el-row>
        <span class="timer">{{ date | formatDate }}</span>
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

export default {
  components: {
    Select: () => import('@/components/Select/index.vue'),
    Screenfull: () => import('@/components/Screenfull')
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'account',
      'name',
      'id',
      'device',
      'buildingarray',
      'permission_routes',
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
    .icon{
      font-size:25px;
      padding:0px 8px;
      cursor: pointer;
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
      margin-right: 15px;

      .avatar-wrapper {
        position: relative;
      }
    }

    .el-dropdown{
      font-size: 18px;
      color: black;
    }

    .timer{
      float: right;
      margin-right: 15px;
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
