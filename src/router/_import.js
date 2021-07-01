
export default file => {
    return map[file] || map['404']
}
  
const map = {
    '404':()=>  import('@/views/404.vue'),
    'sys-Building':()=> import('@/views/building/index.vue'),
    'sys-Setting': () => import('@/views/membersetting/index.vue'),
    'fileManager': () => import('@/views/building/files.vue'),
    'drawingControl': () => import('@/views/graphic/index.vue'),
    'devicesManagement': () => import('@/views/devicemanagement/equipment/index.vue'),
    'deviceTypesManagement': () => import('@/views/devicemanagement/devicetype/index.vue'),
    'deviceAddressManagement': ()=> import('@/views/devicemanagement/deviceaddress/index.vue'),
    'historyAnalysis': ()=> import('@/views/analysis/index.vue'),
    'emergencyResponse':()=> import('@/views/emergency/marshalling/index.vue'),
    'basic': ()=> import('@/views/normal/basicinfor/index.vue'),
    'maintainManagement':()=> import('@/views/normal/maintenance/index.vue'),
    'ReportInspection':()=>import('@/views/normal/maintenancereport/index.vue'),
    'ReportPublicSafe':()=>import('@/views/normal/publicreport/index.vue'),
    'mainMenuSetting':()=>import('@/views/authority/menu/index.vue'),
    'accessAuthoritySetting':()=>import('@/views/authority/auth/index.vue'),
    'roleSetting':()=>import('@/views/authority/roles/index.vue'),
    'accountSetting':()=>import('@/views/authority/users/index.vue')
}