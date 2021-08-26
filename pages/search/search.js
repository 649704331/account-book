// pages/search.js
const app = getApp()
const util = require("../../utils/util.js")
var selectBook = require("../../utils/select_book.js");
var searchvalue = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    n:0,
    m:0,
    result: '',
    state: '',
    searchvalue: '',
    re: [
  

  
      
    
      ],
    re2:[],
    sum:0,
  },

  searchValueInput: function (e) {
    var that=this
    var value = e.detail.value;
    this.setData({
      searchvalue: value,
    });

  },

 sousuo: function (e) {
   
    var that = this;
    that.data.n=0
    that.data.m=0
    that.setData({
      re:0,
      re2:0
    })
    var searchvalue=that.data.searchvalue
    let query1 = new wx.BaaS.Query()
    let query2 = new wx.BaaS.Query()
    let query3 = new wx.BaaS.Query()
    let tableName = 'Bills'
    

    let Product = new wx.BaaS.TableObject(tableName)
    query1.compare('Bamount', '=', Number(searchvalue)) 
    query1.compare('userid', '=', util.getOpenId())
    query1.compare('Ano', '=', selectBook.getBookType(true))


    query2.contains('Blabel',String(searchvalue) )
    query2.compare('userid', '=', util.getOpenId()) 
    query2.compare('Ano', '=', selectBook.getBookType(true))
    
    query3.contains('Bcomments',String(searchvalue))
    query3.compare('userid', '=', util.getOpenId()) 
    query3.compare('Ano', '=', selectBook.getBookType(true))

    let orQuery = wx.BaaS.Query.or(query2, query3)
    console.log("value="+searchvalue)

    // if (searchvalue == null) {
      
    //   Product.find().then(res => {
    //     that.setData({

    //       re: res.data.objects,

    //     })
    //     // success
    //   }, err => {
    //     // err


    //   })
    // }

     if (!isNaN(Number(searchvalue))){//数据合法
      Product.setQuery(query1).find().then(res => {
        console.log(res.data.objects)

        that.setData({
          re: res.data.objects,
          n: res.data.objects.length,

        })
        console.log(that.data.n)
        //success
      }, err => {
        // err
        that.setData({
          n: 0
        })
        console.log(that.data.n)
      })
    }

   Product.setQuery(orQuery).find().then(res => {
     console.log(res.data.objects)
     var x=that.data.n;
     that.setData({
       re2: res.data.objects,
       m: res.data.objects.length,
       
     })
     var x = that.data.n+that.data.m;
     that.setData({
      sum:x,

     })
     console.log(that.data.m)
     console.log(that.data.n)
     console.log(that.data.sum)
   })
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})