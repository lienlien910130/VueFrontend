class Parent {
    constructor (data) {
        const { id, isDelete,createTime  } = data
        this.isDelete = isDelete
        this.id = id
        this.createTime = createTime
    }
    
    getID(){
        return this.id
    }

    getInfo(){
        return this
    }
    
}

export default Parent