// 进行状态管理通过getters建立对于模块中属性的快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username // 名字
}
export default getters
