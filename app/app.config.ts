export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    icons: {
      dynamic: true
    },
    // 禁用某些可能导致 SSR 问题的功能
    notifications: {
      position: 'top-right'
    }
  }
})
