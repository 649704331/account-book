var app = getApp();
var that;
var username = wx.getStorageSync("my_nick");
var openid = wx.getStorageSync("user_openid");
var userid = wx.getStorageSync("user_id");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    TopTips: '',
  },
  onLoad: function () {
    that = this;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })
  },

  /*下拉刷新*/
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    that.setData({
      isLoading: false,
      isdisabled: false,
      title: '',
      content: "",
      src: "",
      isSrc: false,
    })
  },

  //上传图片
  uploadPic: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '上传图片需要消耗流量，是否继续？',
      confirmText: '继续',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              that.setData({
                isSrc: true,
                src: tempFilePaths
              })
            }
          })
        }
      }
    });
  },

  //删除图片
  clearPic: function () {//删除图片
    that.setData({
      isSrc: false,
      src: ""
    })
  },

  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入反馈标题'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入反馈内容'
      });
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      });
      wx.showModal({
        title: '提示',
        content: '是否确认提交反馈',
        success: function (res) {
          if (res.confirm) {
            //console.log("2成功");
            let tableName = 'Feedback'
            let Diary = new wx.BaaS.TableObject(tableName);
            let diary = Diary.create()
            diary.set("id", 'userid') //id
            diary.set("Ftitle", title) //标题
            diary.set("Fcontent", content) //内容
            //console.log("3成功");
            diary.save().then(res => {
              wx.showModal({
                title: '提示',
                content: '反馈成功',
                success: function (res) {
                  if (res.confirm) {
                    console.log("反馈成功");
                    that.setData({
                      isLoading: false,
                      isdisabled: false,
                      title: '',
                      content: "",
                      src: "",
                      isSrc: false,
                    })
                  }
                  else {
                    that.setData({
                      isLoading: false,
                      isdisabled: false,
                      title: '',
                      content: "",
                      src: "",
                      isSrc: false,
                    })
                  }
                },
              })
            }, err => {
              //err 为 HError 对象
            })
          }
          else {
            that.setData({
              isLoading: false,
              isdisabled: false,
              title: '',
              content: "",
              src: "",
              isSrc: false,
            })
          }
        },
      })
    }
  }
})
