// pages/mine/mine.js
//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
  profile: {
    'photo': '/image/头像.png',
    'name': '赵二狗',
  }},

  feedback: function (options) {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  about: function (options) {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  /*下拉刷新*/
    onPullDownRefresh: function () {
      console.log("下拉刷新")
      
  },

  onLoad: function (e) {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
  /* 转发*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '转发',
      path: `pages/index/index`,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
})
