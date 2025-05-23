import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// require.context(目标目录，是否扫描子目录，正则表达式) 扫描目标目录下的文件
// 下面三行代码的任务是 把 同级目录的 svg目录下的.svg图片引入到项目中来
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req) // 调用方法

// 相当于把svg下的所有的svg图片打包到了项目中
// 如果想用svg图片 就在svg目录下去寻找就可以了
