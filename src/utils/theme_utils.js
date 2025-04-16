const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题的文字颜色
    titleColor: '#ffffff',
    // 左上角logo的图标路径
    logoSrc: 'logo_dark.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_dark.png'

  },
  vintage: {
    // 背景颜色
    backgroundColor: '#eeeeee',
    // 标题的文字颜色
    titleColor: '#000000',
    // 左上角logo的图标路径
    logoSrc: 'logo_light2.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_light.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_light.png'
  }
}

// 添加新的主题配色方案以及图表所需的颜色
export const getThemeValue = (themeName) => {
  const themeConfig = {
    chalk: {
      backgroundColor: '#161522',
      titleColor: '#ffffff',
      textColor: '#ffffff',
      lineColor: 'rgba(255, 255, 255, 0.3)',
      splitLineColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: '#2a2f42',
      warningColor: '#e6a23c',
      dangerColor: '#f56c6c',
      successColor: '#67c23a',
      primaryColor: '#409eff',
      logoSrc: 'logo_dark.png',
      themeSrc: 'qiehuan_dark.png',
      headerBorderSrc: 'header_border_dark.png'
    },
    vintage: {
      backgroundColor: '#eeeeee',
      titleColor: '#000000',
      textColor: '#333333',
      lineColor: 'rgba(0, 0, 0, 0.2)',
      splitLineColor: 'rgba(0, 0, 0, 0.1)',
      borderColor: '#d4d7de',
      warningColor: '#e6a23c',
      dangerColor: '#f56c6c',
      successColor: '#67c23a',
      primaryColor: '#409eff',
      logoSrc: 'logo_light2.png',
      themeSrc: 'qiehuan_light.png',
      headerBorderSrc: 'header_border_light.png'
    }
  }
  
  return themeConfig[themeName] || themeConfig.chalk
}
