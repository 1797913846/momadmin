//此为列表页
import React from 'react';
import { Table, Pagination, Modal, Input, Button, DatePicker, Select, Tooltip, Popover } from 'antd';
import { ORIGIN } from '../../constants/index'
//二维码
import QRCode from 'qrcode.react';
import axios from 'axios'
//引入导航
import { MENU } from '../../constants/menudata';
//引入数据字典
import { NAME } from '../../constants/name';
//引入请求接口
import httpAxios from '../../helpers/request';
import erimg from './img/ercode.png';
import './index.css';

import locale from 'antd/es/date-picker/locale/zh_CN';

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const { RangePicker } = DatePicker;
const { Option } = Select;

//定义了一个来自React.Component的子类
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    //数据字典
    this.columns = [];
    this.state = {
      count: 1,
      data: "",
      total: "",
      rows: [],
      labelDom: [],
      filter: {},
      option: {},
      wherePath: '',
      current: 1,
      startTime: '',
      endTime: '',
      dateTime: '',
      qrUrl: '',
      dictionary: '',
      localData: '',
      nowWeek: "",
      extend: "",
      allList: [],
      whereClass: "",
      selectList: [],
      selectDom: "",
      fromOne: "",
      toOne: "",
      visible: false,
      reallyShow: false,
      isEdit: false
    };
  }

  componentDidMount = () => {
    let [url, method, options, labelDom, path, filter, option] = ['', '', '', '', this.props.match.path, {}, {}];
    //nowWeek为本周一和周五,用whereClass区分各自结构的Class
    this.setState({
      nowWeek: this.getCurrentWeek(),
      wherePath: path
    }, () => {
      this.setState({
        whereClass: this.state.wherePath.replace("/", "")
      })
    })
    MENU.map((item, index) => {
      [url, method, options] = this.setSameOptions(path, item, url, method, options);
      if (path == item.path && item.key != 'needTime') {
        item.filter.map((item1, index1) => {
          filter[item1.key] = '';
          option[item1.key] = ''
        })
        this.setState({
          filter: filter,
          option: option
        }, () => {
          console.log('结', this.state.filter);
          let a = this.state.filter;
          let b = this.state.option;
          console.log('item', item)
          for (let key in a) {
            a[item.needTime.key] = this.state.dateTime;
            this.state.option[item.needTime.key] = item.needTime.value;
          }
          console.log('最终结果', a, b);
          //初始化的时候显示数
          options.filter = this.state.filter;
          options.option = this.state.option;
          let atime;
          if (path == '/registQuery' || path == '/registEntrust') {
            if (this.state.nowWeek[0] != '') {
              atime = this.state.nowWeek[0] + '~' + this.state.nowWeek[1]
            } else {
              atime = " "
            }
          } else if (path == '/menberList' || path == '/inviteList') {
            atime = " "
          } else {
            if (this.state.nowWeek[0] != '') {
              atime = this.state.nowWeek[0] + ' 00:00' + '~' + this.state.nowWeek[1] + ' 23:59'
            } else {
              atime = " "
            }
          }
          let lastkey = "";
          let jsonobj = this.state.filter;
          for (let key in jsonobj) {
            lastkey = key;
          }
          this.state.filter[lastkey] = atime;
          this.getData(url, method, false, options);
        });
        /**
         * 操作类型：fund_stream_type_dict
         * 流水标的fund_stream_source_dict
         * 是否结算yes_no_dict
         * 结算方式settle_type_dict
         * 买卖方向appoint_type_dict
         * 类型hold_change_type_dict
         */
        let localData = JSON.parse(localStorage.getItem('localData'));
        this.setState({
          localData: localData
        })
        labelDom = item.filter.map((item1, index1) => (
          item1.value != '操作类型' && item1.value != '流水标的' && item1.value != '是否结算' && item1.value != '结算方式' && item1.value != '买卖方向' ?
            <div key={index1} className='inputArray'>
              <label for={item1.key}>{item1.value} : </label>
              <Input id={item1.key} value={item.value} onChange={this.handelChange} className='searchInput' allowClear={true} autoComplete="off" />
            </div>
            : ''
        ))
      }
    })
    this.setState({
      labelDom: labelDom
    });
  }

  //设置公共参数
  setSameOptions(path, item, url, method, options) {
    if (path === item.path) {
      console.log(33333)
      url = item.url;
      if (item.path != '/index') {
        method = 'post'
      } else {
        method = 'get'
      }
      if (path == '/historyList') {
        options = {
          page: this.state.current,
          size: 16,
          sort: 'subTradeScale',
          order: 'desc',
          filter: this.state.filter,
          option: this.state.option
        };
      } else {
        options = {
          page: this.state.current,
          size: 16,
          filter: this.state.filter,
          option: this.state.option
        };
      }
    }
    return [url, method, options];
  }

  //用来获取下拉选项
  getDom(dom, key) {
    const mainArray = dom[key];
    return mainArray.map((item1, key1) => (
      <Option value={item1.k}> {item1.v} </Option>
    ))
  }

  //获取本周一和周日的时间
  getCurrentWeek() {
    //起止日期数组    
    let startStop = new Array();
    //获取当前时间    
    let currentDate = new Date();
    //返回date是一周中的某一天    
    let week = currentDate.getDay();
    //返回date是一个月中的某一天    
    let month = currentDate.getDate();

    //一天的毫秒数    
    let millisecond = 1000 * 60 * 60 * 24;
    //减去的天数    
    let minusDay = week != 0 ? week - 1 : 4;
    //alert(minusDay);    
    //本周 周一    
    let monday = new Date(currentDate.getTime() - (minusDay * millisecond));
    //本周 周日    
    let sunday = new Date(monday.getTime() + (4 * millisecond));
    monday = moment(monday).format('YYYY-MM-DD');
    sunday = moment(sunday).format('YYYY-MM-DD');
    //添加本周时间    
    startStop.push(monday); //本周起始时间    
    //添加本周最后一天时间    
    startStop.push(sunday); //本周终止时间
    console.log('本周起止时间', startStop);
    //返回    
    return startStop;
  }
  //监听搜索输入框改变
  handelChange = event => {
    let e = event.target;
    console.log('拿到的', e.id, e.value)
    console.log('filter啊2', this.state.filter)
    for (let key in this.state.filter) {
      if (key == e.id) {
        this.state.filter[key] = e.value;
        this.state.option[key] = 'LIKE';
      }
    }
    console.log('最后', this.state.filter);
  }
  //监听下拉框改变
  handelChangeOther = (value, event, who) => {
    this.state.filter[who] = value;
    console.log('最后2', this.state.filter, '88', value, '99', event, 'who', who);
    this.state.option[who] = 'LIKE';
  }
  //点击搜索
  searchNow() {
    this.setState({
      current: 1
    }, () => {
      let url, method, options;
      let path = this.props.match.path;
      MENU.map((item, index) => {
        [url, method, options] = this.setSameOptions(path, item, url, method, options);
      })
      this.getData(url, method, false, options);
    });
  }
  //导出
  exportExcel() {
    let excelUrl, excelName;
    if (this.state.wherePath == '/moneyWater') {
      //资金流水
      excelUrl = `${ORIGIN}` + '/api.v1/fund/stream/export';
      excelName = '资金流水.xls';
    } else if (this.state.wherePath == '/registQuery') {
      //成交信息
      excelUrl = `${ORIGIN}` + '/api.v1/stock/order/history/deal/export';
      excelName = '成交信息.xls';
    } else if (this.state.wherePath == '/registEntrust') {
      //委托信息
      excelUrl = `${ORIGIN}` + '/api.v1/stock/order/history/entrust/export';
      excelName = '委托信息.xls';
    }
    let method = 'post';
    let beel = false;
    let options = {
      page: this.state.current,
      size: this.state.total || 16,
      filter: this.state.filter,
      option: this.state.option
    };
    axios({ // 用axios发送post请求
      method: method,
      url: excelUrl, // 请求地址
      data: options, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    })
      .then((res) => { // 处理返回的文件流
        const content = res
        const blob = new Blob([content])
        const fileName = excelName
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
  }
  getAccountList() {
    let url = '/api.v1/user/options';
    let method = 'get';
    let beel = false;
    let options = null;
    httpAxios(url, method, beel, options).then(res => {
      this.setState({
        selectList: res.data
      }, () => {
        let selectDom = this.state.selectList.map((item, index) => (
          <Option value={item.v}>{item.k}</Option>
        ))
        this.setState({
          selectDom: selectDom
        })
      })
    })
  }
  selectChange(selectedOption) {
    if (!selectedOption) {
      selectedOption = ''
    }
    console.log('没值', selectedOption)
    this.setState({
      fromOne: selectedOption
    }, () => {
      console.log('选择后', this.state.fromOne)
    })
  }
  selectChange1(selectedOption) {
    if (!selectedOption) {
      selectedOption = ''
    }
    this.setState({
      toOne: selectedOption
    })
  }
  addNewNow() {
    this.getAccountList();
    this.setState({
      reallyShow: true,
      fromOne: "",
      toOne: "",
      isEdit: false
    })
  }
  noShowReal() {
    this.setState({
      reallyShow: false
    })
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  addNewPerson() {
    if (this.state.fromOne == this.state.toOne) {
      this.setState({
        visible: true,
        msg: '推荐人和客户不能一样'
      }, () => {
        console.log('666', this.state.msg)
      });
    } else {
      let url = '/api.v1/user/invite/add';
      let method = 'post';
      let beel = false;
      let options = {
        from: this.state.fromOne,
        to: this.state.toOne
      };
      httpAxios(url, method, beel, options).then(res => {
        if (res.code === 0) {
          this.setState({
            reallyShow: false
          })
          this.searchNow();
        } else {
          this.setState({
            visible: true,
            msg: res.msg
          }, () => {
            console.log('666', this.state.msg)
          });
        }
      })
    }
  }
  //请求列表数据
  getData(url, method, beel, options) {
    httpAxios(url, method, beel, options).then(res => {
      if (res.code === 0) {
        res.data.rows.map((item, index) => {
          if (index == 0) {
            for (let key in item) {
              if (item.hasOwnProperty(key)) {
                NAME.map((item1, index1) => {
                  if (key == item1.key) {
                    if (key == 'create_time' || key == 'opeartor_time') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        align: 'center',
                        ellipsis: true,
                        width: 250
                      })
                    } else if (key == 'remark') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        align: 'center',
                        ellipsis: true,
                        width: 300
                      })
                    } else if (key == 'sub_trade_scale') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        ellipsis: true,
                        align: 'center',
                        width: 230
                      })
                    } else if (key == 'self_trade_scale') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        ellipsis: true,
                        align: 'center',
                        width: 140
                      })
                    } else if (key == 'invite_code_desc') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        align: 'center',
                        width: 80,
                        render: (text, record) => (
                          <div className='ermax'>{text != '' ? <img className='curimg' onClick={() => this.showImg(text, record)} src={erimg} /> : '-'}{this.state.qrUrl && text == this.state.qrUrl ?
                            <div className='ercode1' onClick={() => this.noShowImg()}>
                              <div className='erimg1' ref={this.myRef}>
                                <QRCode
                                  value={this.state.qrUrl}
                                  size={160}
                                  fgColor="#000000"
                                />
                              </div>
                            </div> : ''}</div>
                        )
                      })
                    } else if (key == 'referral_code_desc') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        align: 'center',
                        width: 80,
                        render: (text, record) => (
                          <div className='ermax'>{text != '' ? <img className='curimg' onClick={() => this.showImg1(text, record)} src={erimg} /> : '-'}{this.state.qrUrl1 && text == this.state.qrUrl1 ?
                            <div className='ercode1' onClick={() => this.noShowImg1()}>
                              <div className='erimg1' ref={this.myRef}>
                                <QRCode
                                  value={this.state.qrUrl1}
                                  size={160}
                                  fgColor="#000000"
                                />
                              </div>
                            </div> : ''}</div>
                        )
                      })
                    } else if (key !== 'invite_code_desc') {
                      this.columns.push({
                        title: item1.name,
                        dataIndex: item1.key,
                        key: item1.key,
                        align: 'center',
                        ellipsis: true,
                        width: 120
                      })
                    }
                  }
                })
              }
            }
          }
          if (this.state.wherePath == '/inviteList') {
            this.columns.push({
              title: '操作',
              key: 'operation',
              align: 'center',
              ellipsis: true,
              width: 120,
              dataIndex: 'operation',
              render: (text, record) =>
                <a onClick={() => this.changeLast(text, record)}>修改</a>
            })
          }
          this.columns = this.deteleObject(this.columns);
        })
        this.setState({
          data: res.data,
          total: res.data.total || null,
          rows: res.data.rows || null,
          //统计数据
          extend: res.data.extend || null,
          count: parseInt(this.total / 20)
        }, () => {
          if (this.state.wherePath == '/commissionStatistics' || this.state.wherePath == '/registQuery' || this.state.wherePath == '/registEntrust' || this.state.wherePath == '/registSettlement' || this.state.wherePath == '/orderSttleInvite') {
            if (this.state.rows.length > 0) {
              //把数据push进去
              let AK = this.state.rows;
              //拷贝一个新数组
              let aL = [JSON.parse(JSON.stringify(this.state.rows[0]))];
              aL = aL.map((item, index) => {
                console.log('序列', item, index)
                for (let key in item) {
                  if (item.hasOwnProperty(key) && this.state.extend.hasOwnProperty(key)) {
                    item[key] = this.state.extend[key];
                  } else {
                    item[key] = '-'
                  }
                }
                return item;
              })
              console.log('我是新数组', aL)
              this.setState({
                allList: aL
              }, () => {
                this.setState({
                  rows: [...AK, this.state.allList[0]]
                }, () => {
                  if (this.state.rows.length > 0) {
                    //统计
                    let aLength = this.state.rows;
                    //佣金统计
                    if (this.state.wherePath == '/commissionStatistics') {
                      this.state.rows[aLength.length - 1]['account_code'] = '统计'
                    }
                    //成交信息
                    if (this.state.wherePath == '/registQuery') {
                      this.state.rows[aLength.length - 1]['deal_date_desc'] = '统计'
                    }
                    //委托信息
                    if (this.state.wherePath == '/registEntrust') {
                      this.state.rows[aLength.length - 1]['order_date_desc'] = '统计'
                    }
                    //结算信息
                    if (this.state.wherePath == '/registSettlement') {
                      this.state.rows[aLength.length - 1]['account_code'] = '统计'
                    }
                    //结算信息
                    if (this.state.wherePath == '/orderSttleInvite') {
                      this.state.rows[aLength.length - 1]['account_code'] = '统计'
                    }
                  }
                })
                console.log('大', this.state.rows, typeof (this.state.rows));
              })

            }
          }
        });
      }
    })
  }
  changeLast(text, record) {
    console.log('修改', text, record, record.from_user)
    this.setState({
      reallyShow: true,
      fromOne: record.from_user,
      toOne: record.to_user,
      isEdit: true
    })
  }
  //显示二维码
  showImg(text, record) {
    console.log('对象', record);
    let index = this.state.rows.indexOf(record);
    console.log('第几项', index);
    let url = record.invite_code_desc;
    this.setState({
      qrUrl: url,
    }, () => {
      this.myRef.current.style.top = (index / 20) * 90 + '%';
    });
  }
  showImg1(text, record) {
    console.log('对象', record);
    let index = this.state.rows.indexOf(record);
    console.log('第几项', index);
    let url = record.referral_code_desc;
    this.setState({
      qrUrl1: url,
    }, () => {
      console.log('地址', this.state.qrUrl1)
      this.myRef.current.style.top = (index / 20) * 90 + '%';
    });
  }
  //隐藏二维码
  noShowImg() {
    this.setState({
      qrUrl: '',
    }, () => {
    });
  }
  noShowImg1() {
    this.setState({
      qrUrl1: '',
    }, () => {
    });
  }
  //数组去重
  deteleObject(obj) {
    let uniques = [];
    let stringify = {};
    for (let i = 0; i < obj.length; i++) {
      let keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return (Number(a) - Number(b));
      });
      let str = '';
      for (let j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  }
  //分页改变
  onChange = page => {
    console.log(page);
    this.setState({
      current: page,
    }, () => {
      let url, method, options;
      let path = this.props.match.path;
      MENU.map((item, index) => {
        [url, method, options] = this.setSameOptions(path, item, url, method, options);
      })
      this.getData(url, method, false, options);
    });
  }
  //时间改变
  onChangeTime = (value, dateString) => {
    let path = this.props.match.path;
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    //历史成交查询,历史委托查询
    let atime;
    if (path == '/registQuery' || path == '/registEntrust') {
      if (dateString[0] != '') {
        atime = dateString[0] + '~' + dateString[1]
      } else {
        atime = this.state.nowWeek[0] + '~' + this.state.nowWeek[1]
      }
    } else if (path == '/menberList') {
      if (dateString[0] != '') {
        atime = dateString[0] + ' 00:00' + '~' + dateString[1] + ' 23:59'
      } else {
        atime = ""
      }
    } else if (path == '/inviteList') {
      atime = ""
    } else {
      if (dateString[0] != '') {
        atime = dateString[0] + ' 00:00' + '~' + dateString[1] + ' 23:59'
      } else {
        atime = this.state.nowWeek[0] + ' 00:00' + '~' + this.state.nowWeek[1] + ' 23:59'
      }
    }

    this.setState({
      dateTime: atime
    }, () => {
      console.log('时间', this.state)
      let lastkey = "";
      let jsonobj = this.state.filter;
      for (let key in jsonobj) {
        lastkey = key;
      }
      console.log('我是', lastkey);
      this.state.filter[lastkey] = this.state.dateTime;
      console.log('时间2', this.state)
    });
  }

  render() {
    const { rows, localData, labelDom, wherePath, whereClass, total, nowWeek, selectList, selectDom, reallyShow, isEdit, fromOne, toOne } = this.state;
    const columns = this.columns;
    const dateFormat = 'YYYY-MM-DD';
    const dateFormatList = ['YYYY-MM-DD', 'YYYY-MM-DD'];
    const a = moment(nowWeek[0]);
    const b = moment(nowWeek[1]);
    console.log('拿到的周值啊', nowWeek, a, b, typeof (a));
    return (
      <div>
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <p>{this.state.msg}</p>
        </Modal>
        <div className="searchBox">
          {labelDom}
          {wherePath == '/moneyWater' ?
            <div>
              <div className='inputArray'>
                <label>操作类型 :</label>
                <Select style={{ width: 150 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'type') }} allowClear={true}>
                  {this.getDom(localData, 'fund_stream_type_dict')}
                </Select>
              </div>
              <div className='inputArray'>
                <label>流水标的 :</label>
                <Select style={{ width: 120 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'source') }} allowClear={true}>
                  {this.getDom(localData, 'fund_stream_source_dict')}
                </Select>
              </div></div> : (wherePath == '/commissionStatistics' ? <div>
                <div className='inputArray'>
                  <label>是否结算 :</label>
                  <Select style={{ width: 120 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'is_settled') }} allowClear={true}>
                    {this.getDom(localData, 'yes_no_dict')}
                  </Select>
                </div>
                <div className='inputArray'>
                  <label>结算方式 :</label>
                  <Select style={{ width: 140 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'settle_type') }} allowClear={true}>
                    {this.getDom(localData, 'settle_type_dict')}
                  </Select>
                </div></div> : (wherePath == '/changeRecord' ?
                  <div>
                    <div className='inputArray'>
                      <label>类型 :</label>
                      <Select style={{ width: 150 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'type') }} allowClear={true}>
                        {this.getDom(localData, 'hold_change_type_dict')}
                      </Select>
                    </div>
                  </div> : (wherePath == '/registEntrust' ?
                    <div>
                      <div className='inputArray'>
                        <label>买卖方向 :</label>
                        <Select style={{ width: 120 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'subType') }} allowClear={true}>
                          {this.getDom(localData, 'appoint_type_dict')}
                        </Select>
                      </div>
                    </div> : '')))}
          {wherePath != '/inviteList' ?
            <div className='inputArray'>
              <label>日期 :</label>
              {
                wherePath != '/menberList' ? <RangePicker
                  onChange={this.onChangeTime}
                  locale={locale}
                  className='dateStyle'
                  placeholder={[this.state.nowWeek[0], this.state.nowWeek[1]]}
                /> : <RangePicker
                    onChange={this.onChangeTime}
                    locale={locale}
                    className='dateStyle'
                  />
              }

            </div> : ''}
          <Button className="searchBtn" type="primary" onClick={() => this.searchNow()}>查询</Button>
          {
            wherePath == '/moneyWater' || wherePath == '/registQuery' || wherePath == '/registEntrust' ? <Button className="searchBtn" type="primary" onClick={() => this.exportExcel()}>导出</Button> : ''
          }
          {
            wherePath == '/inviteList' ? <Button className="searchBtn" type="primary" onClick={() => this.addNewNow()}>新增</Button> : ''
          }
          {
            wherePath == '/inviteList' && reallyShow == true ?
              <div className='bigSelectBox'>
                <div className="selectBox">
                  <div className="closeNow" onClick={() => this.noShowReal()}>X</div>
                  <div className="tuijian">
                    <label>客户 : </label>
                    <Select style={{ width: 200 }} onChange={(e) => this.selectChange1(e)} defaultValue={toOne} disabled={isEdit == true} allowClear>
                      {selectDom}
                    </Select>
                  </div>
                  <div className="tuijian">
                    <label>推荐人 : </label>
                    <Select style={{ width: 200 }} onChange={(e) => this.selectChange(e)} defaultValue={fromOne} allowClear>
                      {selectDom}
                    </Select>
                  </div>
                  <Button className="addBtn" type="primary" onClick={() => this.addNewPerson()}>确定</Button>
                </div>
              </div> : ''
          }
        </div>
        <div className="tableBox">
          <Table className={whereClass} dataSource={rows} columns={columns} size="small" scroll={{ y: 670 }} pagination={false} />
          <div className="pagen">
            <Pagination size="small" current={this.state.current} defaultPageSize={16} onChange={this.onChange} total={total} />
          </div>
        </div>
      </div>
    );
  }
}

export default EditableTable;