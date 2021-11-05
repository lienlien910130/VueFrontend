import Parent from './parent'
class PhysicalInfo extends Parent {
    constructor (data) {
        super(data)
        const { name, cToken, model } = data
        this.name = name
        this.cToken = cToken
        this.model = model
    }
}

export default PhysicalInfo