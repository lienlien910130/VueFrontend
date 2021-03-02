const DB_NAME = 'mercuryfire'
const DB_VERSION = 1
let DB

export default {

	async getDb() {
		return new Promise((resolve, reject) => {
			if(DB) { return resolve(DB) }
			let request = window.indexedDB.open(DB_NAME, DB_VERSION)
			
			request.onerror = e => {
				console.log('Error opening db', e)
				reject('Error')
			}
	
			request.onsuccess = e => {
				DB = e.target.result
                console.log('Opening DB success')
				resolve(DB)
			}
			
			request.onupgradeneeded = e => {
				console.log('onupgradeneeded')
				let db = e.target.result
                db.createObjectStore("buildingInfo", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("buildingFloors", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("graphicJson", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("buildingList", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("buildingContactunit", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("buildingUsers", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("buildingDevices", { autoIncrement: true, keyPath:'id' })
                db.createObjectStore("buildingOptions", { autoIncrement: true, keyPath:'id' }) 
			}
		})
	},
    async deleteDb(){
        let db = await this.getDb()
        db.close()
        var DBDeleteReq = window.indexedDB.deleteDatabase(DB_NAME)
        DBDeleteReq.onsuccess = function(event) { 
            console.log("Database deleted successfully")
            DB = null
        }            
    },
    async getValue(tableName,id=null) {
		let db = await this.getDb()
		return new Promise(resolve => {
			let trans = db.transaction([tableName],'readonly')
            let store = trans.objectStore(tableName)
            let dbRequest
            if (id == null) {
                dbRequest = store.getAll()
            }else{
                dbRequest = store.get(id)
            }
            dbRequest.onsuccess = (event) => { // 成功後的回撥
                resolve(event.target.result) // 返回物件
            }
            trans.onerror = (event) => {
                reject(event)
            }
			// trans.oncomplete = () => {
			// 	resolve(_data)
			// }
			// let store = trans.objectStore(tableName)
			// let _data = []
			// store.openCursor().onsuccess = e => {
			// 	let cursor = e.target.result
			// 	if (cursor) {
			// 		_data.push(cursor.value)
			// 		cursor.continue()
			// 	}
			// }
		})
	},
    async saveValue(tableName,data) {
		let db = await this.getDb()
		return new Promise(resolve => {
			let trans = db.transaction([tableName],'readwrite')
            let store = trans.objectStore(tableName)
            data.forEach(element => {
                store.put(element)    
            })
			trans.oncomplete = () => {
				resolve()
			}
		})
	},
    async updateValue(tableName,data) {
		let db = await this.getDb()
		return new Promise(resolve => {
			let trans = db.transaction([tableName],'readwrite')
            trans
                .objectStore(tableName)
                .get(data.id)
                .onsuccess = (event)=>{
                    const newObject = { ...event.target.result, ...data }
                    trans
                        .objectStore(tableName) // 獲取store
                        .put(newObject) // 修改物件
                        .onsuccess = (event) => { // 成功後的回撥
                            console.log('updateObject -- onsuccess- event:', event)
                            resolve(event.target.result)
                        }
                }
                trans.onerror = (event) => {
                    reject(event)
                }
		})
	},
	async deleteData(tableName) {
		let db = await this.getDb()
		return new Promise(resolve => {
			let trans = db.transaction([tableName],'readwrite')
            trans
                .objectStore(tableName)
                .clear()
                .onsuccess = (event)=>{
                    resolve(event)
                }
            trans.onerror = (event) => {
                reject(event)
            }
		})
	},
}