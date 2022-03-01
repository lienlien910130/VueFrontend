<template>
  <div>
    <el-dialog
      top="5vh"
      :width="dialogWidth"
      :title=" title = '聯絡方式'"
      :visible= "test"  
      @close="handleClickOption('cancel')"   
      append-to-body          
      center>

      <div class="content">    
          <div class="picture">
            <el-avatar :size=100 src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          </div>

          <div class="inner-content">
            <ul>
              <li>姓名 : </li>
              <li>緊急連絡人 : </li>
              <li>E-mail : </li>
              <li>聯絡方式 :</li>       
            </ul>

            <ul>
              <li>盧俊辰123</li>
              <li>盧俊臣</li>
              <li>ji3g48xj6@gmail.com</li>
              <li>緊急電話 : 034561236</li>
              <li>手機 : 0956123654</li>        
            </ul>          
          </div>    
      </div>      
    </el-dialog>
  </div>
</template>

<script>

import computedmixin from "@/mixin/computedmixin";
import Setting from "@/object/setting";
import { changeDefaultFullType } from "@/utils/index";
import constant from "@/constant/index";
import {
  Account,
  Contactunit,
  Files,
  Inspection,
  MaintainManagementList,
  SelfDefenseFireMarshalling,
} from "@/object";
const moment = require("moment");
export default {
  name: "DialogContact",
  mixins: [computedmixin],
  props: {
    dialogData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
    dialogStatus: {
      type: String,
    },
    isHasButtons: {
      type: Boolean,
      default: true,
    },
    buttonsName: {
      type: Array,
    },
    config: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
    selectData: {
      type: Array,
    },
  },
  computed: {
    dialogWidth() {
      if (this.$store.state.app.device === "mobile") {
        return "90%";
      } else {
        if (this.excelType == "exportExcel") return "500px";
        return "1000px";
      }
    },  
    
  },
  data() {
    return {
        test : true
    };
  },
  mounted() {
      console.log('innermounted', this.config, this.title, this.dialogData)
  },
  methods: {
    handleClickOption(status){
            this.$emit('handleDialog',this.title, status , this.accessArray)
    },
  
  },
};
</script>

<style lang="scss" scoped>
  .content {
    @media (max-width:576px){
      display: block;
    }     
      
    display: flex;

    & .picture {
      @media (max-width:576px){
      text-align: center;
      margin-right: 0px;
    }  
      margin-right: 50px;
      padding-left: 30px;
      text-align: center;
    }
}

.inner-content {
  @media (max-width:576px){
    border: none;
    justify-content: space-evenly;
  }  

  display: flex;
  border-left: 2px solid powderblue;

  & ul {
    list-style-type: none;
    @media (max-width:576px){
    padding: 0;
  }  

    & li {
      line-height: 30px;
    }
}
}
</style>
