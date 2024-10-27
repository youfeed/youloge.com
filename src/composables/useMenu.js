export default [
    {
      title: '个人主页',
      name: 'index',
      icon:'home'
    },{
      title: '文章专栏',
      name: 'article',
      icon:'home',
      children: [
        {
          title: '文章管理',
          name: 'article'
        }
      ]
    },{
        title: '我的云盘',
        name: 'drive',
        children: [
          {
            title: '云盘文件',
            name: 'drive'
          },{
            title: '已购资源',
            name: 'drivebuyed'
          },{
            title: '交易记录',
            name: 'drivetrade'
          }
        ]
    },{
        title: '钱包余额',
        name: 'wallet',
        children: [
          {
            title: '钱包零钱',
            name: 'wallet'
          },{
            title: '消费账单',
            name: 'billing'
          }
        ]
    },{
      title: '退出登录',
      name: 'logout',
      icon:'home'
    }
];