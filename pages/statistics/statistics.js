var wxCharts = require('../../utils/wxcharts.js');
var util = require("../../utils/util.js");
var selectBook = require("../../utils/select_book.js");
var ringChart = null;
var columnChart = null;
var lineChart = null;
var chartData = {
  main: {
    title: '总成交量',
    data: [0, 0, 0, 0, 0, 0,
      0, 0, 15, 0, 0, 0,
      0, 3, 45, 47, 180, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      34],
    categories: ['1', '2', '3', '4', '5', '6',
      '7', '8', '9', '10', '11', '12',
      '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24',
      '26', '27', '28', '29', '30',
      '31']
  }
};
var app = getApp();

Page({
  data: {
    //导航栏
    navbar: ['分类', '流水'],
    currentTab: 0,
    total: 0,
    showFlag: true,//为TRUE时显示未记账
    //初始化指环图数据
    ringData: [
      {
        kind: '食',
        countNum: 0,
        amount: 0
      },
      {
        kind: '住',
        countNum: 0,
        amount: 0
      },
      {
        kind: '购',
        countNum: 0,
        amount: 0
      },
      {
        kind: '行',
        countNum: 0,
        amount: 0
      },
      {
        kind: '乐',
        countNum: 0,
        amount: 0
      },
      {
        kind: '育',
        countNum: 0,
        amount: 0
      },
      {
        kind: '医',
        countNum: 0,
        amount: 0
      },

    ],
    //日期选择
    startDate: '2019-01-01', //默认起始时间
    endDate: '2019-06-24', //默认结束时间
    //流水表格数据
    tableData: [{ //模拟动态获取到的后台数据：数组对象格式
      id: 0,
      name: '时间'
    },
    {
      id: 1,
      name: '收入'
    },
    {
      id: 2,
      name: '支出'
    },
    {
      id: 3,
      name: '结余'
    },
    {
      id: 4,
      name: '3月'
    },
    {
      id: 5,
      name: '2000'
    },
    {
      id: 6,
      name: '0'
    },
    {
      id: 7,
      name: '2000'
    },
    {
      id: 8,
      name: '2月'
    },
    {
      id: 9,
      name: '500'
    },
    {
      id: 10,
      name: '1500'
    },
    {
      id: 11,
      name: '-1000'
    },
    {
      id: 12,
      name: '1月'
    },
    {
      id: 13,
      name: '0'
    },
    {
      id: 14,
      name: '2000'
    },
    {
      id: 15,
      name: '-2000'
    }
    ],
    //将后台获取到的数组对象数据按照一行4个的单元数据的格式切割成新的数组对象
    fourArray: ''

  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //画指环图
  drawRing: function (object) {

    this.setData({
      showFlag: false
    })


    //设置指环图大小
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    //计算各个数据
    //总支出
    var temptotal = 0;
    for (var i = 0; i < object.length; i++)
      temptotal -= object[i].Bamount;
    temptotal = Math.round(temptotal * 100) / 100;

    //分类
    //食住购行乐育医
    var array = [0, 0, 0, 0, 0, 0, 0];
    var count = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < object.length; i++) {
      if (object[i].Btype == '食') {
        array[0] -= object[i].Bamount;
        count[0]++;
      }
      else if (object[i].Btype == '住') {
        array[1] -= object[i].Bamount;
        count[1]++;
      }
      else if (object[i].Btype == '购') {
        array[2] -= object[i].Bamount;
        count[2]++;
      }
      else if (object[i].Btype == '行') {
        array[3] -= object[i].Bamount;
        count[3]++;
      }
      else if (object[i].Btype == '乐') {
        array[4] -= object[i].Bamount;
        count[4]++;
      }
      else if (object[i].Btype == '育') {
        array[5] -= object[i].Bamount;
        count[5]++;
      }
      else if (object[i].Btype == '医') {
        array[6] -= object[i].Bamount;
        count[6]++;
      }
    }

    this.setData({
      total: temptotal,
      ringData: [
        {
          kind: '食',
          countNum: count[0],
          amount: array[0]
        },
        {
          kind: '住',
          countNum: count[1],
          amount: array[1]
        },
        {
          kind: '购',
          countNum: count[2],
          amount: array[2]
        },
        {
          kind: '行',
          countNum: count[3],
          amount: array[3]
        },
        {
          kind: '乐',
          countNum: count[4],
          amount: array[4]
        },
        {
          kind: '育',
          countNum: count[5],
          amount: array[5]
        },
        {
          kind: '医',
          countNum: count[6],
          amount: array[6]
        },
      ]
    })

    //指环图
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 15,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: this.data.total,
        color: '#7cb5ec',
        fontSize: 25
      },
      subtitle: {
        name: '总支出',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '食',
        color: '#b3ff00',
        data: this.data.ringData[0].amount,
        stroke: false
      }, {
        name: '住',
          color: '#4698f7',
        data: this.data.ringData[1].amount,
        stroke: false
      }, {
        name: '购',
          color: '#FF2D2D',
        data: this.data.ringData[2].amount,
        stroke: false
      }, {
        name: '行',
          color: '#f80',
        data: this.data.ringData[3].amount,
        stroke: false
      }, {
        name: '乐',
          color: '#FFD700',
        data: this.data.ringData[4].amount,
        stroke: false
      }, {
        name: '育',
          color: '#8E388E',
        data: this.data.ringData[5].amount,
        stroke: false
      }, {
        name: '医',
          color: '#FF34B3',
        data: this.data.ringData[6].amount,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 300,
      dataLabel: true,
      legend: true,
      background: '#f5f5f5',
      padding: 0
    });
  },

  //画折线图
  drawLine: function (object) {
    var that = this;

    var startDate = new Date(that.data.startDate);
    var startMonth = startDate.getMonth();
    var startYear = startDate.getFullYear();

    var endDate = new Date(that.data.endDate);
    var endMonth = endDate.getMonth();
    var endYear = endDate.getFullYear();

    var month = (endYear - startYear) * 12 + endMonth - startMonth;
    var tableOut = [];
    var tableIn = [];

    var time = null;
    var tmp = 0;
    for (let i = 0; i < object.length; i++) {
      time = new Date(object[i].Btime);
      tmp = (time.getFullYear() - startYear) * 12 + time.getMonth() - startMonth;
      if (tableOut[tmp] == null)
        tableOut[tmp] = 0;
      if (tableIn[tmp] == null)
        tableIn[tmp] = 0;
      if (object[i].Bamount < 0)
        tableOut[tmp] += object[i].Bamount;
      else if (object[i].Bamount > 0)
        tableIn[tmp] += object[i].Bamount;
    }
    //更新tableData
    let tableData = [];
    for (let i = 0; i < 4; i++) {
      tableData.push(that.data.tableData[i]);
    }
    var tmp = null;
    var tableMonth = [];
    for (let i = month; i >= 0; i--) {
      if (tableIn[i] == null || tableOut[i] == null)
        continue;
      var tMonth = (startMonth + i) % 12 + 1;
      var tYear = startYear + Math.trunc((startMonth + i) / 12);
      tmp = {
        id: i * 4 + 0,
        name: tYear + " - " + tMonth
      };
      tableMonth.push(tmp.name);
      tableData.push(tmp);
      tmp = {
        id: i * 4 + 1,
        name: tableIn[i]
      }
      tableData.push(tmp);
      tmp = {
        id: i * 4 + 2,
        name: tableOut[i]
      }
      tableData.push(tmp);
      tmp = {
        id: i * 4 + 3,
        name: tableIn[i] + tableOut[i]
      }
      tableData.push(tmp);
    }
    that.setData({
      tableData: tableData
    })

    //更新fourArray
    let fourArray = [];
    // 使用for循环将原数据切分成新的数组
    for (let i = 0, len = that.data.tableData.length; i < len; i += 4) {
      fourArray.push(that.data.tableData.slice(i, i + 4));
    }
    that.setData({
      fourArray: fourArray
    })

    var categories = [];
    var tableInNew = [];
    var tableOutNew = [];
    var tableRem = [];
    var cnt = tableMonth.length - 1;
    for (let i = 0; i <= month; i++) {
      if (tableIn[i] == null)
        continue;
      categories.push(tableMonth[cnt]);
      cnt--;
      tableInNew.push(tableIn[i]);
      tableOutNew.push(-tableOut[i]);
      tableRem.push(tableIn[i] + tableOut[i]);
    }
    //折线图
    lineChart = new wxCharts({
      canvasId: 'lineCanvas', // canvas-id
      type: 'line', // 图表类型，可选值为pie, line, column, area, ring
      categories: categories,
      series: [{
        name: '收入',
        data: tableInNew
      }, {
        name: '支出',
        data: tableOutNew
      }, {
        name: '结余',
        data: tableRem
      }],
      yAxis: {
        min: 0 // Y轴起始值
      },
      width: 310,
      height: 290,
      dataLabel: true, // 是否在图表中显示数据内容值
      legend: true // 是否显示图表下方各类别的标识
    });
  },


  //更新指环图数据
  updateRing: function () {

    var tableName = 'Bills';
    let Product = new wx.BaaS.TableObject(tableName);
    let query = new wx.BaaS.Query()
    query.compare('Bamount', '<', 0)
    //用户ID
    console.log(util.getOpenId())
    query.contains('userid', util.getOpenId())
    query.compare('Ano', '=', selectBook.getBookType(true))
    query.compare('Btime', '>=', this.data.startDate)
    query.compare('Btime', '<=', this.data.endDate)
    Product.setQuery(query).find().then(res => {
      // success
      var total = 0;
      // console.log(res.data.objects)
      var object = res.data.objects

      var temptotal = 0;
      for (var i = 0; i < object.length; i++)
        temptotal -= object[i].Bamount;
      temptotal = Math.round(temptotal * 100) / 100;

      //分类
      //食住购行乐育医
      var array = [0, 0, 0, 0, 0, 0, 0];
      var count = [0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < object.length; i++) {
        if (object[i].Btype == '食') {
          array[0] -= object[i].Bamount;
          count[0]++;
        }
        else if (object[i].Btype == '住') {
          array[1] -= object[i].Bamount;
          count[1]++;
        }
        else if (object[i].Btype == '购') {
          array[2] -= object[i].Bamount;
          count[2]++;
        }
        else if (object[i].Btype == '行') {
          array[3] -= object[i].Bamount;
          count[3]++;
        }
        else if (object[i].Btype == '乐') {
          array[4] -= object[i].Bamount;
          count[4]++;
        }
        else if (object[i].Btype == '育') {
          array[5] -= object[i].Bamount;
          count[5]++;
        }
        else if (object[i].Btype == '医') {
          array[6] -= object[i].Bamount;
          count[6]++;
        }
      }

      this.setData({
        total: temptotal,
        ringData: [
          {
            kind: '食',
            countNum: count[0],
            amount: array[0]
          },
          {
            kind: '住',
            countNum: count[1],
            amount: array[1]
          },
          {
            kind: '购',
            countNum: count[2],
            amount: array[2]
          },
          {
            kind: '行',
            countNum: count[3],
            amount: array[3]
          },
          {
            kind: '乐',
            countNum: count[4],
            amount: array[4]
          },
          {
            kind: '育',
            countNum: count[5],
            amount: array[5]
          },
          {
            kind: '医',
            countNum: count[6],
            amount: array[6]
          },
        ]
      })

      ringChart.updateData({
        title: {
          name: this.data.total
        },
        subtitle: {
          name: '总支出'
        },
        series: [{
          name: '食',
          color: '#b3ff00',
          data: this.data.ringData[0].amount,
          stroke: false
        }, {
          name: '住',
            color: '#4698f7',
          data: this.data.ringData[1].amount,
          stroke: false
        }, {
          name: '购',
            color: '#FF2D2D',
          data: this.data.ringData[2].amount,
          stroke: false
        }, {
          name: '行',
            color: '#f80',
          data: this.data.ringData[3].amount,
          stroke: false
        }, {
          name: '乐',
            color: '#FFD700',
          data: this.data.ringData[4].amount,
          stroke: false
        }, {
          name: '育',
            color: '#8E388E',
          data: this.data.ringData[5].amount,
          stroke: false
        }, {
          name: '医',
            color: '#FF34B3',
          data: this.data.ringData[6].amount,
          stroke: false
        }]

      });
    }, err => {
      // err
    })


  },

  //更新折线图和流水表格数据
  updateLine: function () {
    var that = this;

    var startDate = new Date(that.data.startDate);
    var startMonth = startDate.getMonth();
    var startYear = startDate.getFullYear();

    var endDate = new Date(that.data.endDate);
    var endMonth = endDate.getMonth();
    var endYear = endDate.getFullYear();

    var month = (endYear - startYear) * 12 + endMonth - startMonth;
    var tableOut = [];
    var tableIn = [];



    var tableName = 'Bills';
    let Product = new wx.BaaS.TableObject(tableName);
    let query = new wx.BaaS.Query()
    //用户ID
    console.log(util.getOpenId())
    query.contains('userid', util.getOpenId())
    query.compare('Ano', '=', selectBook.getBookType(true))
    query.compare('Btime', '>=', this.data.startDate)
    query.compare('Btime', '<=', this.data.endDate)
    Product.setQuery(query).find().then(res => {
      // success
      var object = res.data.objects;
      //如果选择日期期间没有数据
      if (object.length == 0)
      {
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        let tmp = {
          Ano : 1,
          Bamount : 0,
          Bcomments : "",
          Blabel : "",
          Btime : date,
          Btype : "",
          created_at:15810115716
        }
        startDate = date;
        endDate = date;
        startMonth = startDate.getMonth();
        startYear = startDate.getFullYear();
        endMonth = endDate.getMonth();
        endYear = endDate.getFullYear();
        object.push(tmp);
      }
      var time = null;
      var tmp = 0;
      for (let i = 0; i < object.length; i++) {
        time = new Date(object[i].Btime);
        tmp = (time.getFullYear() - startYear) * 12 + time.getMonth() - startMonth;
        if (tableOut[tmp] == null)
          tableOut[tmp] = 0;
        if (tableIn[tmp] == null)
          tableIn[tmp] = 0;
        if (object[i].Bamount < 0)
          tableOut[tmp] += object[i].Bamount;
        else if (object[i].Bamount > 0)
          tableIn[tmp] += object[i].Bamount;
      }

      //更新tableData
      let tableData = [];
      for (let i = 0; i < 4; i++) {
        tableData.push(that.data.tableData[i]);
      }
      var tmp = null;
      var tableMonth = [];
      for (let i = month; i >= 0; i--) {
        if (tableIn[i] == null || tableOut[i] == null)
          continue;
        var tMonth = (startMonth + i) % 12 + 1;
        var tYear = startYear + Math.trunc((startMonth + i) / 12);
        tmp = {
          id: i * 4 + 0,
          name: tYear + " - " + tMonth
        };
        tableMonth.push(tmp.name);
        tableData.push(tmp);
        tmp = {
          id: i * 4 + 1,
          name: tableIn[i]
        }
        tableData.push(tmp);
        tmp = {
          id: i * 4 + 2,
          name: tableOut[i]
        }
        tableData.push(tmp);
        tmp = {
          id: i * 4 + 3,
          name: tableIn[i] + tableOut[i]
        }
        tableData.push(tmp);
      }
      that.setData({
        tableData: tableData
      })

      //更新fourArray
      let fourArray = [];
      // 使用for循环将原数据切分成新的数组
      for (let i = 0, len = that.data.tableData.length; i < len; i += 4) {
        fourArray.push(that.data.tableData.slice(i, i + 4));
      }
      that.setData({
        fourArray: fourArray
      })

      var categories = [];
      var tableInNew = [];
      var tableOutNew = [];
      var tableRem = [];
      var cnt = tableMonth.length - 1;
      for (let i = 0; i <= month; i++) {
        if (tableIn[i] == null)
          continue;
        categories.push(tableMonth[cnt]);
        cnt--;
        tableInNew.push(tableIn[i]);
        tableOutNew.push(-tableOut[i]);
        tableRem.push(tableIn[i] + tableOut[i]);
      }
      //更新折线图
      lineChart.updateData({
        categories: categories,
        series: [{
          name: '收入',
          data: tableInNew
        }, {
          name: '支出',
          data: tableOutNew
        }, {
          name: '结余',
          data: tableRem
        }]
      })

    }, err => {
      // err
    })



  },

  //日期选择函数
  // 时间段选择 
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      startDate: e.detail.value,
    })
    if (that.data.currentTab == 1)
      this.updateLine();
    else
      this.updateRing();
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      endDate: e.detail.value,
    })
    if (that.data.currentTab == 1)
      this.updateLine();
    else
      this.updateRing();
  },

  onShow: function (e) {
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
    }).then(resid => {
      var tableName = 'Bills';
      let Product = new wx.BaaS.TableObject(tableName);
      let query = new wx.BaaS.Query()
      query.compare('Bamount', '<', 0)
      //用户ID
      query.contains('userid', resid.result.OPENID)
      query.compare('Ano','=',selectBook.getBookType(true))
      query.compare('Btime', '>=', this.data.startDate)
      query.compare('Btime', '<=', this.data.endDate)
      Product.setQuery(query).find().then(res => {
        // success
        var total = 0;
        console.log(res.data.objects)
        var object = res.data.objects
        if(res.data.objects.length!=0)
          this.drawRing(object);
     

      }, err => {
        // err
      })

      var tableName2 = 'Bills';
      let Product2 = new wx.BaaS.TableObject(tableName2);
      let query2 = new wx.BaaS.Query()
      query2.contains('userid', resid.result.OPENID)
      query2.compare('Ano', '=', selectBook.getBookType(true))
      query2.compare('Btime', '>=', this.data.startDate)
      query2.compare('Btime', '<=', this.data.endDate)
      Product2.setQuery(query2).find().then(res => {
        // success
        var object = res.data.objects
        if (res.data.objects.length != 0)
        {
          this.drawLine(object);
        }
        else {
          var object;
          var tmp = {
            Ano: 1,
            Bamount: 0,
            Bcomments: "",
            Blabel: "",
            Btime: "2019-05-01",
            Btype: "",
            created_at: 15810115716
          }
          object.push(tmp);
          this.drawLine(object);
        }
      }, err => {
        // err
      })
      this.updateRing();
      this.updateLine()
    })

  },




})