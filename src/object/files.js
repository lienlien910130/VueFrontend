import api from "@/api";
const moment = require("moment");
import Parent from "./parent";

class Files extends Parent {
  constructor(data) {
    super(data);
    const {
      fileOriginalName,
      uploadTime,
      extName,
      uploadUserID,
      targetModule,
      targetID,
    } = data;
    this.fileOriginalName = fileOriginalName;
    this.uploadTime = uploadTime;
    this.extName = extName;
    this.uploadUserID = uploadUserID;
    this.targetModule = targetModule;
    this.targetID = targetID;
  }

  getID() {
    return this.id;
  }
  getFileName() {
    return this.fileOriginalName;
  }
  getExtName() {
    return this.extName;
  }
  getModule() {
    return this.targetModule;
  }
  getUploadTime() {
    return moment(this.uploadTime).format("YYYY-MM-DD HH:mm");
  }

  clone(data) {
    return new Files(data);
  }
  async download() {
    var data = await api.files
      .apiGetFile(this.id)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  // async image(){
  //     var data = await api.files.apiGetImage(this.id).then(response => {
  //         return response
  //     }).catch(error=>{
  //         return []
  //     })
  //     return data
  // }
  static async delete(id) {
    var data = await api.files
      .apiDeleteFile(id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async getOfID(fileId) {
    var data = await api.files
      .apiGetFileOfId(fileId)
      .then((response) => {
        return new Files(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getImage(fileId) {
    var data = await api.files
      .apiGetImage(fileId)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.files
      .apiGetAllFiles(data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Files(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

export default Files;
