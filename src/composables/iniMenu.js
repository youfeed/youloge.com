export default [
    {
      title: '首页',
      path: '/'
    },
    {
      title: '文档',
      path: '/docs',
      children: [
        {
          title: '介绍',
          path: '/docs/intro'
        },
        {
          title: '指南',
          path: '/docs/guide'
        }
      ]
    },
    {
      title: '社区',
      path: '/community'
    }
];