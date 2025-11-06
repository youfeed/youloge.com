export default [
    {
      title: '个人主页',
      name: 'index',
      icon:'tdesign:user-list'
    },{
      title: '聊天通讯',
      name: 'message',
      icon:'tdesign:chat-bubble-smile',
      children: [
        {
          title: '聊天会话',
          name: 'message'
        },{
          title: '通讯录',
          name: 'contact'
        }
      ]
    },{
      title: '文章专栏',
      name: 'article',
      icon:'tdesign:article',
      children: [
        {
          title: '文章管理',
          name: 'article'
        }
      ]
    },{
      title: '我的视频',
      name: 'video',
      icon:'tdesign:video',
      children: [
        {
          title: '视频管理',
          name: 'video'
        }
      ]
    },{
        title: '我的云盘',
        name: 'drive',
        icon:'tdesign:hard-drive',
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
        title: '开发密钥',
        name: 'apikey',
        icon:'tdesign:wallet',
        children: [
          {
            title: '密钥列表',
            name: 'apikey'
          }
        ]
    },{
        title: '钱包余额',
        name: 'wallet',
        icon:'tdesign:wallet',
        children: [
          {
            title: '钱包零钱',
            name: 'wallet'
          },{
            title: '消费账单',
            name: 'billing'
          }
        ]
    }
];