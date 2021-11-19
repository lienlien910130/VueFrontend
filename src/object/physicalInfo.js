import Parent from "./parent";
import api from "@/api";

class PhysicalInfo extends Parent {
  constructor(data) {
    super(data);
    const { name, cToken, model } = data;
    this.name = name;
    this.cToken = cToken;
    this.model = model;
  }
  clone(data) {
    return new PhysicalInfo(data);
  }
  static async update(data) {
    var data = await api.user
      .apiPatchPhysicalInfo(data)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async create(data) {
    var temp = JSON.parse(JSON.stringify(data));
    temp.name = "{Check}" + temp.name;
    temp.model = "{Check}" + temp.model;
    var data = await api.user
      .apiPostPhysicalInfo(temp)
      .then((response) => {
        return new PhysicalInfo(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async delete(id) {
    var data = await api.user
      .apiDeletePhysicalInfo(id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default PhysicalInfo;
