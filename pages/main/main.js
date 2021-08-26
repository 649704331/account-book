const selectBook = require("../../utils/select_book.js")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

    openId: null,

    // head
    toYear: 0, //当前年份
    toMonth: 0, //当前月份
    monthIncome: 0, //月份收入
    monthOutcome: 0, //月份支出
    abudget1: 0, //预算结余
    //array: ['日常', '旅行', '班费', '生意', '新建账本'],
    index: 0,
    actionSheetHidden: true,
    actionSheetItems: [{
        bindtap: 'Menu1',
        txt: '搜索账单'
      },
      {
        bindtap: 'Menu2',
        txt: '更换背景'
      },
      {
        bindtap: 'Menu3',
        txt: '批量编辑'
      }
    ],
    menu: '',
    // body
    bill: { //每条账单样本
      ano: 0,
      bamount: 0,
      btime: '2019-05-01',
      blabel: '早餐'
    },
    bills: [ //保存所有账单
    ],
    billOfTheday: { //每天账单样本
      id: 'list0',
      date: {
        year: 2019,
        month: 5,
        day: 1,
        week: '星期三'
      },
      totalRevenue: 0,
      totalExpenses: 0,
      bills: []
    },
    infoList: [ //保存所有信息
    ],
    // foot
    budgetText: "",
    budgetHidden: true,
    buttonColorList: [
      ["#f9d422", "#fc913a", "#ff4e50", "#fe4365", "#f9cdad", "#cbc8a9", "#83af98"],
      ["#c3d825", "#b8d200", "#aacf53", "#3eb370", "#028760", "#548235"],
      ["#c1e4e9", "#a2d7dd", "#84a2d4", "#698aab", "#00a3af", "#4c6cb3", "#19448e", "#223a70"],
      ["#e9546b", "#c85554", "#c53d43", "#e83929", "#c9171e", "#cd5e3c", "#ec6d51"],
      ["#f6ad49", "#f39800", "#f08300", "#ea5506", "#e45e32", "#e17b34", "#f7b977", "#cd8347"],
      ["#ffea00", "#ffd900", "#ffec47", "#fef263", "#f5e56b", "#ebd842", "#f8b500", "#e6b422"],
      ["#7058a3", "#674196", "#9079ad", "#65318e", "#522f60", "#884898"],
      ["#c85179", "#eb6ea5", "#e95295", "#e198b4", "#f09199", "#f2a0a1"],
    ],
    buttonIndex: 1,
    buttonText: [
      ["工资", "投资收入", "兼职外快", "生活费", "红包", "借入", "报销"],
      ["早餐", "午餐", "晚餐", "零食", "酒水饮料", "水果"],
      ["房租", "水费", "电费", "酒店", "物业", "网费", "中介费", "房贷"],
      ["数码设备", "服饰", "鞋包饰品", "日用品", "化妆护肤", "运动", "保健"],
      ["打车", "公交", "停车场", "加油", "车票", "过路费", "机票", "共享单车"],
      ["游戏", "电影", "门票", "会员", "KTV", "上网", "按摩", "打牌"],
      ["学费", "文具", "书籍", "考试", "培训", "辅导班"],
      ["药费", "挂号", "检查", "保险", "医保", "住院"],
    ],
    bTypeText: ["收", "食", "住", "购", "行", "乐", "育", "医"],
    calendarData: [],
    year: 0,
    month: 0,
    date: 0,
    day: 0,
    bookingShow: false,
    payOrGet: "支",
    payOrGetBG: "yellow",
    buttonHidden: false,
    markTextHidden: true,
    calculatorHidden: true,
    calendarHidden: true,
    payTypeHidden: true,
    noteHidden: true,
    noteTitle: "",
    money: "0.0", //显示在记账器上的数
    bType: "食",
    payType: "支付方式",
    carryBit: 10, //用来搞进位的
    number: [0, 0], //计算器的数据
    numberIndex: 0, //计算器的索引
    computeSign: "",
    markText: "",
    mark: ["", ""],
    markIndex: 0,
    filePath: "",
  },


  //head
  bindPickerChange: function(e) { //中间选择器
    console.log('picker下拉项发生变化后，下标为：', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
    selectBook.setBookType(this.data.index);
    this.initBookData();
  },

  actionSheetTap: function() { //页面右上角功能
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function() {
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    //搜索账单
    this.linkToSearch();
  },
  bindMenu2: function() {
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    //更换背景
    let that = ""
    wx.chooseImage({
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res1 => { //成功的回调
            console.log('data:image/png;base64,' + res.data);
            that = 'data:image/png;base64,' + res1.data
            this.setData({
              filePath: 'data:image/png;base64,' + res1.data
            })
          }
        })
      }
    })



  },

  bindMenu3: function() {
    this.setData({
      menu: 3,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  //body
  getLableID: function(lable) {
    let textTable = this.data.buttonText;
    for (let i = 0; i < textTable.length; i++) {
      for (let j = 0; j < textTable[i].length; j++) {
        if (lable == textTable[i][j]) {
          return ((i + 1) * 16 + j + 1) % 256;
        }
      }
    }
    return 127;
  },
  getBillData: function() {
    let billsTemp = new Array();
    //bills保存所有账单信息

    //创建查询，获取并保存所有当前年、月账单信息
    let nowTime = new Date();
    let nowYear = nowTime.getFullYear().toString();
    let nowMonth = (nowTime.getMonth() + 1).toString();

    let table_bill = 'Bills'; //被查询的表的名称
    let tableObject = new wx.BaaS.TableObject(table_bill); //被查询的表对象
    let query = new wx.BaaS.Query(); //查询条件

    let condition_time = nowYear + "-" + (nowMonth.length < 2 ? "0" + nowMonth : nowMonth);
    //console.log('year :' + nowYear + ' month : ' + nowMonth + ' ' + condition_time);
    query.contains('Btime', condition_time); //时间需为当前年月
    query.compare('userid', '=', this.data.openId); //id须为当前用户对应的ID
    query.compare('Ano', '=', selectBook.getBookType(true))
    //开始查询，保存所有当前年月账单信息
    tableObject.setQuery(query).orderBy('-Btime').find().then(res => {
      //遍历获取的内容列表
      let billData = res.data.objects;
      console.log(billData);
      for (let i = 0; i < billData.length; i++) {
        let billTemp = new Object();

        billTemp.ano = billData[i].Ano;
        billTemp.bamount = billData[i].Bamount;
        billTemp.btime = billData[i].Btime;
        billTemp.blabel = billData[i].Blabel;
        billTemp.id = billData[i].id;

        billsTemp.push(billTemp);
      }
      //console.log(billsTemp);
      //须在当前线程下进行以下动作
      //遍历账单数组，分类账单
      let infoListTemp = new Array();
      let currentTime = "";
      let currentLength = 0;
      let i = 0;
      for (var billTemp of billsTemp) {
        //根据标签获得颜色样式
        let colorNumber = this.getLableID(billTemp.blabel);
        billTemp.color = this.getColor(billTemp.blabel);
        //'#' + '4169' + '0123456789ABCDEFGH'.charAt(colorNumber / 16 % 16) + '0123456789ABCDEFGH'.charAt(colorNumber % 16);
        //console.log(billTemp.color);

        if (i == 0) {
          currentTime = billTemp.btime;
          let infoTemp = new Object();
          currentLength += 1;
          let time = new Date(currentTime);
          infoTemp.date = new Object();
          infoTemp.id = billTemp.id;
          //添加日期信息
          infoTemp.date.year = time.getFullYear();
          infoTemp.date.month = time.getMonth() + 1;
          infoTemp.date.day = time.getDate();
          infoTemp.date.week = '星期' + '日一二三四五六'.charAt(time.getDay());
          //添加收支信息
          if (billTemp.bamount > 0) {
            infoTemp.totalRevenue = billTemp.bamount;
            infoTemp.totalExpenses = 0.0;
          } else {
            infoTemp.totalRevenue = 0.0;
            infoTemp.totalExpenses = billTemp.bamount;

            billTemp.bamount = billTemp.bamount;
          }
          //添加当天账单信息
          infoTemp.bills = new Array();
          infoTemp.bills.push(billTemp);
          //
          infoListTemp.push(infoTemp);


        } else {
          if (billTemp.btime != currentTime) { //创建新节点
            currentTime = billTemp.btime;
            let infoTemp = new Object();
            currentLength += 1;

            let time = new Date(currentTime);
            infoTemp.date = new Object();
            infoTemp.id = billTemp.id;
            //添加日期信息
            infoTemp.date.year = time.getFullYear();
            infoTemp.date.month = time.getMonth() + 1;
            infoTemp.date.day = time.getDate();
            infoTemp.date.week = '星期' + '日一二三四五六'.charAt(time.getDay());
            //添加收支信息
            if (billTemp.bamount > 0) {
              infoTemp.totalRevenue = billTemp.bamount;
              infoTemp.totalExpenses = 0.0;
            } else {
              infoTemp.totalRevenue = 0.0;
              infoTemp.totalExpenses = billTemp.bamount;

              billTemp.bamount = billTemp.bamount;
            }
            //添加当天账单信息
            infoTemp.bills = new Array();
            infoTemp.bills.push(billTemp);
            //
            infoListTemp.push(infoTemp);
          } else {
            let infoTemp = infoListTemp[currentLength - 1];
            //添加当天账单信息
            infoTemp.bills.push(billTemp);
            //更新收支信息
            if (billTemp.bamount > 0) {
              console.log(infoTemp.totalRevenue);
              infoTemp.totalRevenue += Math.round(billTemp.bamount * 100) / 100;
            } else {
              infoTemp.totalExpenses += billTemp.bamount;

              billTemp.bamount = billTemp.bamount;
            }
          }
        }
        i++;
      }

      this.setData({
        infoList: infoListTemp,
      })
      console.log(this.data.infoList);
    }, err => {
      //error!
    })
  },

  // foot
  deleteData: function(e) {
    //console.log(e.currentTarget.dataset.text);
    var tableName = "Bills";
    let MyTableObject = new wx.BaaS.TableObject(tableName);
    MyTableObject.delete(e.currentTarget.dataset.text);
    this.initBookData();
  },
  linkToSearch: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  getColor: function(label) {
    //console.log(label);
    let buttonText = this.data.buttonText;
    let buttonColorList = this.data.buttonColorList;
    for (var i = 0; i < buttonText.length; i++) {
      for (var j = 0; j < buttonText[i].length; j++) {
        //console.log(buttonText[i][j]);
        if (label == buttonText[i][j]) {
          return buttonColorList[i][j];
        }
      }
    }
    return "white";
  },
  initCalendar: function(y, m) {
    let calendarData = [];
    let starDay = new Date(y + ',' + (m + 1) + ',' + 1).getDay(); //获取目标月份第一天的星期
    let dayNums = new Date(y, m + 1, 0).getDate(); //获取目标月份的天数
    let i = 0; //循环体
    let j = 1; //用来输出日期
    for (; i < starDay; i = (i + 1) % 7) {
      calendarData.push("/");
    }
    for (; j <= dayNums; i = (i + 1) % 7) {
      calendarData.push(j);
      j++;
    }
    for (; i < 7; i++) {
      calendarData.push("/");
    }
    this.setData({
      calendarData: calendarData
    })
  },
  initButtons: function(e) {
    let a = e.currentTarget.dataset.text;
    this.data.bType = this.data.bTypeText[a];
    this.setData({
      buttonIndex: a,
    })
  },
  showBooking: function() {
    this.setData({
      bookingShow: true
    });
    //console.log(util.getOpenId());
  },
  hiddenBooking: function() {
    this.setData({
      bookingShow: false,
      budgetHidden: true,
    });
  },
  changePayOrGet: function() {
    if (this.data.payOrGet == "支") {
      this.setData({
        payOrGet: "收",
        payOrGetBG: "red",
        buttonIndex: 0,
      });
    } else {
      this.setData({
        payOrGet: "支",
        payOrGetBG: "yellow",
        buttonIndex: 1,
      });
    }
    this.showButton();
    this.clearCalculator();
  },
  hiddenButton: function() {
    this.setData({
      buttonHidden: true
    });
  },
  showButton: function() {
    this.setData({
      buttonHidden: false
    });
    this.hiddenNote();
  },
  hiddenCalculator: function() {
    this.setData({
      calculatorHidden: true
    });
  },
  showCalculator: function() {
    this.setData({
      calculatorHidden: false
    });
    this.hiddenCalendar();
    this.hiddenPayType();
    this.hiddenMark();
  },
  hiddenCalendar: function() {
    this.setData({
      calendarHidden: true
    });
  },
  showCalendar: function() {
    this.setData({
      calendarHidden: false
    });
    this.hiddenCalculator();
    this.hiddenPayType();
    this.hiddenMark();
  },
  hiddenPayType: function() {
    this.setData({
      payTypeHidden: true
    });
  },
  showPayType: function() {
    this.setData({
      payTypeHidden: false
    });
    this.hiddenCalculator();
    this.hiddenCalendar();
    this.hiddenMark();
  },
  hiddenNote: function() {
    this.setData({
      noteHidden: true
    });
    this.hiddenCalculator();
    this.hiddenCalendar();
    this.hiddenPayType();
  },
  showNote: function() {
    this.setData({
      noteHidden: false
    });
    this.hiddenButton();
  },
  note: function(e) {
    let str = e.currentTarget.dataset.text;
    this.setData({
      noteTitle: str
    });
    this.showNote();
    this.showCalculator();
  },
  chooseDate: function(e) {
    if (e.currentTarget.dataset.text != "/") {
      this.setData({
        date: e.currentTarget.dataset.text,
      })
    }
  },
  nextMonth: function() {
    let month = this.data.month + 1;
    if (month >= 12) {
      this.setData({
        year: this.data.year + 1,
        month: 0,
      })
    } else {
      this.setData({
        month: month,
      })
    }
    this.initCalendar(this.data.year, this.data.month);
  },
  lastMonth: function() {
    let month = this.data.month - 1;
    if (month < 0) {
      this.setData({
        year: this.data.year - 1,
        month: 11,
      })
    } else {
      this.setData({
        month: month,
      })
    }
    this.initCalendar(this.data.year, this.data.month);
  },
  nextYear: function() {
    let year = this.data.year + 1;
    //鬼知道会不会有无聊的人点1000下
    if (year < 3000 && year > 0) {
      this.setData({
        year: year,
      })
      this.initCalendar(this.data.year, this.data.month);
    }
  },
  lastYear: function() {
    let year = this.data.year - 1;
    //鬼知道会不会有无聊的人点1000下
    if (year < 3000 && year > 0) {
      this.setData({
        year: year,
      })
      this.initCalendar(this.data.year, this.data.month);
    }
  },
  addText: function(e) {
    let index = this.data.numberIndex;
    let carryBit = this.data.carryBit;
    let number = this.data.number;
    if (e.currentTarget.dataset.text == ".") {
      if (carryBit < 1) {
        return;
      }
      this.data.carryBit = 0.1;
      if (index == 0) {
        this.setData({
          money: number[0].toString() + ".",
        })
      } else {
        this.setData({
          money: number[0].toString() + this.data.computeSign + number[1].toString() + ".",
        })
      }
      return;
    }
    if (carryBit == 10) {
      if (number[index] > 9999) {
        return;
      }
      number[index] = number[index] * carryBit + e.currentTarget.dataset.text;
      this.setData({
        number: number,
      })
      if (index == 0) {
        this.setData({
          money: number[0].toString(),
        })
      } else {
        this.setData({
          money: number[0].toString() + this.data.computeSign + number[1].toString(),
        })
      }
    } else {
      if (carryBit < 0.01) {
        return;
      }
      number[index] = number[index] * 1 / carryBit + e.currentTarget.dataset.text;
      number[index] *= carryBit;
      this.data.carryBit /= 10;
      number[index] = Math.round(number[index] * 100) / 100;
      if (index == 0) {
        this.setData({
          money: number[0].toString(),
        })
      } else {
        this.setData({
          money: number[0].toString() + this.data.computeSign + number[1].toString(),
        })
      }
    }
  },
  calculate: function(e) {
    let index = this.data.numberIndex;
    let number = this.data.number;
    let computeSign = e.currentTarget.dataset.text;

    this.data.carryBit = 10;

    if (index == 0) {
      this.data.numberIndex = index + 1;
      number[0] = Math.round(number[0] * 100) / 100;
      this.setData({
        computeSign: computeSign,
        money: number[0] + computeSign,
      })
    } else {
      switch (this.data.computeSign) {
        case "+":
          number[0] += number[1];
          number[1] = 0;
          break;
        case "-":
          number[0] -= number[1];
          number[1] = 0;
          break;
        case "*":
          number[0] *= number[1];
          number[1] = 0;
          break;
      }
      number[0] = Math.round(number[0] * 100) / 100;
      this.setData({
        computeSign: computeSign,
        number: number,
        money: number[0] + computeSign,
      })
    }
  },
  clearCalculator: function() {
    this.data.number[0] = 0;
    this.data.number[1] = 0;
    this.data.computeSign = "";
    this.data.carryBit = 10;
    this.data.numberIndex = 0;
    this.setData({
      money: this.data.number[0].toString(),
    })
  },
  record: function(e) {
    this.calculate(e);
    this.sendNote();
    this.showButton();
    this.clearAll();
    this.hiddenBooking();
  },
  clearAll: function() {
    this.setData({
      markText: "",
      mark: ["", ""],
      payType: "支付方式",
    })
    this.clearCalculator();
  },
  sendNote: function() {
    let number = this.data.number;
    if (number[0] == 0) {
      return;
    }
    let mark = this.data.mark;
    let payType = this.data.payType;
    let payOrGet = this.data.payOrGet;
    let year = this.data.year.toString();
    let month = (this.data.month + 1).toString();
    let date = this.data.date.toString();
    if (month.length < 2) {
      month = "0" + month;
    }
    if (date.length < 2) {
      date = "0" + date;
    }
    let time = year + "-" + month + "-" + date;
    console.log(payOrGet);
    //console.log(time);
    var tableName = 'Bills';
    let MyTableObject = new wx.BaaS.TableObject(tableName);
    let MyRecord = MyTableObject.create();
    MyRecord.set({
      Ano: selectBook.getBookType(true),
      Bamount: payOrGet == "收" ? number[0] : -number[0],
      Blabel: this.data.noteTitle,
      Btime: time,
      Btype: payOrGet == "收" ? "收" : this.data.bType,
      userid: this.data.openId,
    });
    if (payType == "支付方式" && mark[0] == "") {
      MyRecord.set('Bcomments', null);
    } else {
      var tempStr = "";
      if (payType != "支付方式") {
        tempStr = payType;
      }
      for (var i = 0; mark[i] != "" && i < 2; i++) { //鬼知道会不会有人打个5000字的备注

        tempStr = tempStr + "/" + mark[i];
      }
      MyRecord.set('Bcomments', tempStr);
    }
    MyRecord.save().then(res => {
      console.log(res)
      this.initBookData();
    }, err => {
      //err
    })
  },
  choosePayType: function(e) {
    this.setData({
      payType: e.currentTarget.dataset.text,
    })
    this.showCalculator();
  },
  showMark: function(e) {
    this.setData({
      markTextHidden: false,
    })
    this.hiddenPayType();
    this.hiddenCalculator();
    this.hiddenCalendar();
    this.data.markIndex = e.currentTarget.dataset.text;
    this.setData({
      markText: this.data.mark[this.data.markIndex],
    })
  },
  hiddenMark: function() {
    this.setData({
      markTextHidden: true,
    })
  },
  addMark: function() {
    let mark = this.data.mark;
    let markIndex = this.data.markIndex;
    for (let i = 0; i < mark.length && i <= markIndex; i++) {
      if (mark[i] == "") {
        mark[i] = this.data.markText;
        this.setData({
          mark: mark,
        })
        this.showCalculator();
        return;
      }
    }
    mark[markIndex] = this.data.markText;
    this.setData({
      mark: mark,
    })
    this.showCalculator();
    return;
  },
  changeMarkText: function(e) {
    this.setData({
      markText: e.detail.value,
    })
  },
  initBookData: function() {

    this.getBillData(); //获得账单明细

    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    this.setData({
      toYear: year, //当前年份
      toMonth: month + 1, //当前月份
    })
    //返回月份收入
    var tableName = 'Bills';
    let toMonth = this.data.toMonth.toString();
    let nowtime = this.data.toYear + "-" + (toMonth.length < 2 ? "0" + toMonth : toMonth);
    let Product = new wx.BaaS.TableObject(tableName);
    let query = new wx.BaaS.Query()
    query.contains('Btime', nowtime)
    query.compare('Bamount', '>', 0)
    query.compare('Ano', '=', selectBook.getBookType(true))
    query.compare('userid', '=', this.data.openId)
    Product.setQuery(query).find().then(res => {
      // success
      console.log(res.data.objects) //查看收入记录
      this.data.monthIncome = 0;
      for (let i = 0; i < res.data.objects.length; i++) {
        this.data.monthIncome += res.data.objects[i].Bamount
      }
      this.setData({
        monthIncome: this.data.monthIncome.toFixed(2)
      })
    }, err => {
      // err
    })

    //返回月份支出和预算结余
    var tableName1 = 'Bills';
    var tableName2 = 'Account_Book';
    let Product1 = new wx.BaaS.TableObject(tableName1);
    let Product2 = new wx.BaaS.TableObject(tableName2);
    let query1 = new wx.BaaS.Query()
    let query2 = new wx.BaaS.Query()
    query1.contains('Btime', nowtime)
    query1.compare('Bamount', '<', 0)
    query1.compare('Ano', '=', selectBook.getBookType(true))
    query1.compare('userid', '=', this.data.openId)
    Product1.setQuery(query1).find().then(res => {
      // success
      console.log(res.data.objects) //查看支出记录
      this.data.monthOutcome = 0;
      for (let i = 0; i < res.data.objects.length; i++) {
        this.data.monthOutcome += res.data.objects[i].Bamount
      }
      this.setData({
        monthOutcome: Math.abs(this.data.monthOutcome).toFixed(2)
      })
      query2.compare('userid', '=', this.data.openId)
      query2.compare('Ano', '=', selectBook.getBookType(true))
      Product2.setQuery(query2).find().then(res => { //查询预算
        // success
        console.log(res.data.objects)
        if (res.data.objects.length > 0) { //防止空结果带来错误
          this.data.abudget1 = res.data.objects[0].Abudget - Math.abs(this.data.monthOutcome).toFixed(2)
        }
        //预算结余=预算-支出
        console.log(Math.abs(this.data.monthOutcome).toFixed(2))
        this.setData({
          abudget1: this.data.abudget1
        })
        // err
      })

    }, err => {
      // err
    })

    //返回预算结余
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取openid
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
    }).then(res => {
      this.data.openId = res.result.OPENID;
      this.initBookData();
    })
    //初始化账本选择
    this.setData({
      array: selectBook.getBookArray(),
    })
    // foot
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate();
    let day = now.getDay();
    this.setData({
      year: year,
      month: month,
      date: date,
      day: day,
      /*toYear: year,  //当前年份
      toMonth: month+1,  //当前月份*/
    })
    this.initCalendar(year, month);
  },
  showBudget: function() {
    var tableName = 'Account_Book';
    let Product = new wx.BaaS.TableObject(tableName)
    let query = new wx.BaaS.Query()
    query.compare('userid', '=', this.data.openId)
    query.compare('Ano', '=', selectBook.getBookType(true))
    Product.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      if (res.data.objects[0].Abudget != 0) {
        this.setData({
          budgetText: res.data.objects[0].Abudget
        })
      } else {
        this.setData({
          budgetText: null
        })
      }
    }, err => {

    })
    this.setData({
      budgetHidden: false,
    })
  },
  changeBudgetText: function(e) {
    this.setData({
      budgetText: e.detail.value,
    })
  },
  addBudget: function() {
    let budget = Number(this.data.budgetText);
    //插入数据
    var tableName = 'Account_Book';
    let Product = new wx.BaaS.TableObject(tableName)
    let query = new wx.BaaS.Query()
    query.compare('userid', '=', this.data.openId)
    console.log(this.data.openId)
    query.compare('Ano', '=', selectBook.getBookType(true))
    console.log(selectBook.getBookType(true))
    Product.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      if (res.data.objects.length > 0) {
        console.log()
        //如果有就更新数据
        let MyTableObject = new wx.BaaS.TableObject(tableName)
        let gxproduct = MyTableObject.getWithoutData(res.data.objects[0].id)
        gxproduct.set('Abudget', isNaN(budget) ? 0 : budget)
        gxproduct.update().then(res => {
          this.initBookData()
        }, err => {

        })
      } else {
        //如果没有就插入数据
        let MyTableObject = new wx.BaaS.TableObject(tableName);
        let MyRecord = MyTableObject.create();
        MyRecord.set({
          Ano: selectBook.getBookType(true),
          userid: this.data.openId,
          Abudget: isNaN(budget) ? 0 : budget,
          Aoutput: 0,
          Aremainder: 0,
        })
        MyRecord.save().then(res => {
          console.log(res)
          this.initBookData()
        }, err => {
          //err
        })
      }
      this.setData({
        budgetHidden: true
      })
    }, err => {
      console.log("err")
    })
  },
  changeNote: function(e) {
    this.showBooking()
    this.showNote()
    this.showCalculator()
    var tableName = 'Bills';
    let Product = new wx.BaaS.TableObject(tableName)
    let query = new wx.BaaS.Query()
    query.compare('id', '=', e.currentTarget.dataset.text)
    Product.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      let timeTemp = new Date()
      this.data.number[0] = res.data.objects[0].Bamount > 0 ? res.data.objects[0].Bamount : -res.data.objects[0].Bamount
      let markTemp = res.data.objects[0].Bcomments
      var j = 0
      if (markTemp != null) {
        this.data.payType = ""
        this.data.mark = ["", ""]
        for (var i = 0; i < markTemp.length && j < 3; i++) {
          if (markTemp[i] == "/") {
            j++
            continue
          }
          if (j == 0) {
            this.data.payType = this.data.payType + markTemp[i]
          } else {
            this.data.mark[j - 1] = this.data.mark[j - 1] + markTemp[i]
          }
        }
      }

      this.setData({
        noteTitle: res.data.objects[0].Blabel,
        bType: res.data.objects[0].Btype == "收" ? "收" : res.data.objects[0].Btype,
        money: this.data.number[0].toString(),
        year: timeTemp.getFullYear(),
        month: timeTemp.getMonth(),
        date: timeTemp.getDate(),
        mark: this.data.mark,
        payType: this.data.payType == "" ? "支付方式" : this.data.payType
      })
      var tableName = "Bills";
      let MyTableObject = new wx.BaaS.TableObject(tableName);
      MyTableObject.delete(e.currentTarget.dataset.text);
    }, err => {

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.initBookData();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})