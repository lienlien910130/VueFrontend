import api from "@/api";

let Setting = {
  getAllOption: async function () {
    var data = await api.setting
      .apiGetBuildingOptions()
      .then((response) => {
        return response.result.sort((x, y) => x.id - y.id);
      })
      .catch((error) => {
        return [];
      });
    return data;
  },
  postOption: async function (data) {
    var temp = JSON.parse(JSON.stringify(data));
    if (
      temp.classType === "InspectionTypeOfTime" ||
      temp.classType === "PublicSafeTypeOfTime"
    ) {
      temp.value = "{Check}" + temp.value;
    }
    if (
      temp.classType !== "InspectionTimeOptions" ||
      temp.classType !== "PublicSafeTimeOptions" ||
      temp.classType !== "MaintainTimeOptions"
    ) {
      temp.textName = "{Check}" + temp.textName;
      temp.classType = "{Check}" + temp.classType;
    }
    var data = await api.setting
      .apiPostOption(temp)
      .then((response) => {
        return response.result;
      })
      .catch((error) => {
        return {};
      });
    return data;
  },
  updateOption: async function (data, hasCheck) {
    var temp = JSON.parse(JSON.stringify(data));
    temp.forEach((element) => {
      if (
        element.classType === "InspectionTypeOfTime" ||
        element.classType === "PublicSafeTypeOfTime"
      ) {
        element.value = "{Check}" + element.value;
      }
      if (hasCheck) {
        element.textName = "{Check}" + element.textName;
        element.classType = "{Check}" + element.classType;
      }
    });
    var data = await api.setting
      .apiPatchOption(temp)
      .then(async (response) => {
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  },
  deleteOption: async function (optionId) {
    var data = await api.setting
      .apiDeleteOption(optionId)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  },
};
export default Setting;
