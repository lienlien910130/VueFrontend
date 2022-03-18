import Files from "@/object/files";
const DB_NAME = "mercuryfire";
const DB_VERSION = 1;
let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log("打開資料庫出現錯誤", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        DB = e.target.result;
        console.log("打開資料庫成功");
        resolve(DB);
      };

      request.onupgradeneeded = (e) => {
        console.log("資料庫版本更新");
        let db = e.target.result;
        var temp = db.createObjectStore("CacheImage", {
          autoIncrement: true,
          keyPath: "imageId",
        });
        temp.createIndex("codeIndex", "imageId", { unique: true });
      };
    });
  },
  async deleteDb() {
    console.log("deleteDb");
    let db = await this.getDb();
    db.close();
    var DBDeleteReq = window.indexedDB.deleteDatabase(DB_NAME);
    DBDeleteReq.onsuccess = function (event) {
      console.log("資料庫刪除成功");
      DB = null;
    };
    DBDeleteReq.onerror = (e) => {
      console.log("資料庫刪除出現錯誤", e);
      reject(e);
    };
    DBDeleteReq.onblocked = function () {
      console.log("無法刪除資料庫");
    };
  },
  async getValue(tableName, id = null) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let trans = db.transaction([tableName], "readonly");
      trans.oncomplete = function (e) {
        console.log(e);
      };
      let store = trans.objectStore(tableName);
      let dbRequest;
      if (id == null) {
        dbRequest = store.getAll();
      } else {
        dbRequest = store.get(id);
      }
      dbRequest.onsuccess = (event) => {
        // 成功後的回撥
        console.log(event.target.result);
        resolve(event.target.result); // 返回物件
      };
      trans.onerror = (event) => {
        reject(event);
      };
    });
  },
  async saveValue(tableName, data) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let trans = db.transaction([tableName], "readwrite");
      let store = trans.objectStore(tableName);
      data.forEach((element) => {
        store.add(element);
      });
      trans.oncomplete = () => {
        resolve();
      };
    });
  },
  async updateValue(tableName, data) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let trans = db.transaction([tableName], "readwrite");
      trans.objectStore(tableName).get(data.id).onsuccess = (event) => {
        const newObject = { ...event.target.result, ...data };
        trans.objectStore(tableName).put(newObject).onsuccess = (event) => {
          console.log("updateObject -- onsuccess- event:", event);
          resolve(event.target.result);
        };
      };
      trans.onerror = (event) => {
        reject(event);
      };
    });
  },
  async deleteData(tableName) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let trans = db.transaction([tableName], "readwrite");
      trans.objectStore(tableName).clear().onsuccess = (event) => {
        resolve(event);
      };
      trans.onerror = (event) => {
        reject(event);
      };
    });
  },

  findCacheImageByIndex(db, imageId) {
    return this.findByIndex(db, "CacheImage", "codeIndex", imageId);
  },

  findByIndex(db, tableName, indexName, searchContent) {
    return new Promise((resolve, reject) => {
      let tx = db.transaction(tableName, "readonly");
      let store = tx.objectStore(tableName);
      let index = store.index(indexName);
      let request = index.get(searchContent);
      request.onsuccess = function () {
        let data = request.result;
        if (data !== undefined) {
          resolve(data);
        } else {
          resolve(null);
        }
      };
    });
  },

  async loadImage(imageId) {
    var data = await Files.getImage(imageId);
    return data;
  },
  saveOrUpdate(db, tableName, data) {
    return new Promise((resolve, reject) => {
      let tx = db.transaction(tableName, "readwrite");
      let store = tx.objectStore(tableName);
      let request = store.put(data);
      request.onsuccess = function () {
        resolve();
      };
      request.onerror = function (e) {
        reject(e);
      };
    });
  },
  saveCacheImage(db, data) {
    return this.saveOrUpdate(db, "CacheImage", data);
  },
  async loadCacheImage(imageId) {
    let db = await this.getDb();
    return new Promise((resolve, reject) => {
      this.findCacheImageByIndex(db, imageId).then((data) => {
        if (!data) {
          //儲存圖片
          this.loadImage(imageId).then((response) => {
            const bufferUrl = btoa(
              new Uint8Array(response).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            var base64 = "data:image/png;base64," + bufferUrl;
            resolve(base64);
            this.saveCacheImage(db, {
              imageId: imageId,
              data: response,
            });
          });
        } else {
          const bufferUrl = btoa(
            new Uint8Array(data.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          var base64 = "data:image/png;base64," + bufferUrl;
          resolve(base64);
        }
      });
    });
  },
};
