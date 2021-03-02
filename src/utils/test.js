export default {
    
    
    // 创建默认数据库
    
    // @returns {*|Promise}
    
    
    createDefaultDB() {
        return this.createOrUpdateDB('H5', 1);
    },
   
    
    // 创建或升级数据库
    
    // 该方法的回调，可以创建表。
    
    // @param dbName 数据库
    
    // @param version 版本号
    
    // @returns {Promise}
    
    createOrUpdateDB(dbName, version) {
        return new Promise((resolve, reject) => {
            let db;
            let request = indexedDB.open(dbName, version);
            //如果数据库不存在，会调用onupgradeneeded和onsuccess。
            //如果数据库升级版本，也会调用onupgradeneeded和onsuccess。
            request.onupgradeneeded = function () {
                db = request.result;
                /*
                * 注意，只有onupgradeneeded可以调用db.createObjectStore()方法。
                * 在onsuccess方法调用db.createObjectStore()方法会报错。
                */
                //一个Promise执行2次resolve()，那么第二次，是不会执行的。因此，需要拆开成2个方法。
                resolve(db);
            };
            
            request.onsuccess = function (e) {
                //db = request.result;
                db = e.target.result;
                let data = {db: db, createObjectStore: false};
                resolve(data);
            };
            
            request.onerror = function (e) {
                reject(e);
            };
        });
    },
    //打开默认数据库
    openDefaultDB() {
        return this.openDB('H5', 1);
    },
    /**
    
    打开数据库
    
    该方法的回调，不能创建表。会报错。
    
    @param dbName 数据库名称
    
    @param version 版本号（数字）
    
    @returns {Promise}
    */
    openDB(dbName, version) {
        return new Promise((resolve, reject) => {
            let db;
            let request = indexedDB.open(dbName, version);
            
            request.onsuccess = function (e) {
            //db = request.result;
            db = e.target.result;
            resolve(db);
            };
            
            request.onerror = function (e) {
            reject(e);
            };
        });
    },
    //判断默认表名是否存在
    existDefaultTableName(db) {
    //缓存图片
        return this.existTableName(db, 'CacheImage');
    },
    //判断表名是否存在
    existTableName(db, tableName) {
        return db.objectStoreNames.contains(tableName);
    },
    //创建默认的表
    createDefaultTable(db) {
        let exist = this.existDefaultTableName(db);
        //不存在，就创建
        if(!exist) {
        let objectStore = db.createObjectStore('CacheImage', {
            keyPath: 'id',
            autoIncrement: true
        });
        objectStore.createIndex('code_index', 'code', {unique: true});
        }
        return true;
    },

    saveCacheImage(db, data) {
        return this.saveOrUpdate(db, 'CacheImage', data);
    },
    
    
    // 新增或更新数据
    
    // 如果数据不存在，就新增。
    
    // 如果数据已存在，则更新。
    
    // 如果是更新数据，那么，该条数据必须指定主键的值，否则报错。
    
    // @param tableName 表名
    
    // @param data json对象的数据，例如：{name: ‘test’, age: 10}
    
    saveOrUpdate(db, tableName, data) {
        return new Promise((resolve, reject) => {
            let tx = db.transaction(tableName, 'readwrite');
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
    findCacheImageByIndex(db, code) {
        return this.findByIndex(db, 'CacheImage', 'code_index', code);
    },
    
    
    // 通过唯一索引，查询数据
    
    // @param db 数据库
    
    // @param tableName 表名
    
    // @param indexName 唯一索引（该字段的数据不会重复）
    
    // @param searchContent 搜索内容
    
    // @returns {Promise}
    
    findByIndex(db, tableName, indexName, searchContent) {
        return new Promise((resolve, reject) => {
            let tx = db.transaction(tableName, 'readonly');
            let store = tx.objectStore(tableName);
            let index = store.index(indexName);
            let request = index.get(searchContent);
            request.onsuccess = function () {
            let data = request.result;
            if(data !== undefined) {
            resolve(data);
            } else {
            resolve(null);
            }
            };
        });
    },
    //异步加载图片，转换成base64字符串
    loadImage(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            //超时时间，单位是毫秒
            xhr.timeout = 60000;
            xhr.responseType = 'blob';
            xhr.ontimeout = (e) => {
                reject(e);
            };
            xhr.onload = () => {
                if(xhr.status === 200) {
                    let blob = xhr.response;
                    let fileReader = new FileReader();
                    //转换成base64
                    fileReader.onload = (e) => {
                        let base64 = e.target.result;
                        resolve(base64);
                    };
                    fileReader.readAsDataURL(blob);
                }
            };
            xhr.send();
        });
    },
    /*
    
    异步加载图片，并缓存起来
    
    @param code 编码
    
    @param imageUrl 图片链接
    
    @returns {Promise} 图片的base64字符串，用于显示在元素的src上
    */
   //先創建資料庫=>創建資料表CacheImage=>打開資料庫=>判斷有無在資料表裡面=>
   //(有)=>如果url改變=>重新下載圖片轉換成base64=>儲存資料 / 如果沒改變=>回傳base64
   //(無)=>加載圖片轉換成base64=>儲存資料
    loadCacheImage(code, imageUrl) { 
        return new Promise((resolve, reject) => {
            this.createDefaultDB().then((db) => {
                this.createDefaultTable(db);
            });
            
            this.openDefaultDB().then((db) => {
                this.findCacheImageByIndex(db, code).then((data) => {
                    if(!data) {
                        this.loadImage(imageUrl).then((base64) => {
                            resolve(base64);
                            this.saveCacheImage(db, {
                                code: code,
                                url: imageUrl,
                                base64: base64});
                        });
                    } else {
                        //链接改变，重新下载图片
                        if(data.url !== imageUrl) {
                            this.loadImage(imageUrl).then((base64) => {
                                resolve(base64);
                                this.saveCacheImage(db, {
                                    id: data.id,
                                    code: code,
                                    url: imageUrl,
                                    base64: base64});
                            });
                        } else {
                            resolve(data.base64);
                        }
                    }
                });
            });
        });
    }
};
    