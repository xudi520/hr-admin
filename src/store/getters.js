// 快速访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  avatar: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId
}
export default getters
