class Parent {
    constructor (data) {
        const { id  } = data
        this.id = id
    }

    getID(){
        return this.id
    }

    getInfo(){
        return this
    }
    
}

export default Parent