//此为主页
import React, { useState } from 'react';
import {
    Table,
    Pagination,
    Modal,
    Tooltip,
    Popover,
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
} from 'antd';
import b1 from './img/b1.png';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import logoimg from './img/banner.png';
import leftimg from './img/leftimg.png';
import t1 from './img/t1.png';
import t2 from './img/t2.png';
import t3 from './img/t3.png';
import t4 from './img/t4.png';
import t5 from './img/t5.png';
import k1 from './img/k1.png';
import tou from './img/tou.png';
import moment from 'moment';
//引入数据字典
import { NAME } from '../../constants/name';

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            data: "",
            rows: [],
            total: '',
            current: 1,
            type: '',
            source: '',
            state: '',
            balance: '',
            withdraw: '',
            deposit: '',
            trade_date: '',
            showDate: false,
            uid: '',
            source: '',
            username: '',
            selectedRowKeys: [],
            deleteUid: '',
            deleteSource: '',
            deleteArr: [],
            showAdd: false,
            uuid: "",
            uuname: "",
            uusource: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getData(1, 16);
        let type = JSON.parse(localStorage.getItem('type'));
        let type1 = {};
        type.map(item => {
            type1[item.k] = item.v
        });

        let source = JSON.parse(localStorage.getItem('source'));
        let source1 = {};
        source.map(item => {
            source1[item.k] = item.v
        });

        let state = JSON.parse(localStorage.getItem('state'));
        let state1 = {};
        state.map(item => {
            state1[item.k] = item.v
        })
        let username = localStorage.getItem('username');
        this.setState({
            'type': type1,
            'source': source1,
            'state': state1,
            'username': username
        })
    }
    getData(page, size) {
        let url = '/api.v1/admin/account/list?page=' + page + '&size=' + size;
        let method = 'get';
        let beel = false;
        let options = null;
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                res.data.rows.map((item, index) => {
                    if (index == 0) {
                        for (let key in item) {
                            if (item.hasOwnProperty(key)) {
                                NAME.map((item1, index1) => {
                                    if (key == item1.key) {
                                        if (key === 'type') {
                                            this.columns.push({
                                                title: item1.name,
                                                dataIndex: item1.key,
                                                key: item1.key,
                                                align: 'center',
                                                ellipsis: true,
                                                width: 120,
                                                render: (text, record) => this.state.type[text]
                                            })
                                        } else if (key === 'source') {
                                            this.columns.push({
                                                title: item1.name,
                                                dataIndex: item1.key,
                                                key: item1.key,
                                                align: 'center',
                                                ellipsis: true,
                                                width: 120,
                                                render: (text, record) => this.state.source[text]
                                            })
                                        } else if (key === 'state') {
                                            this.columns.push({
                                                title: item1.name,
                                                dataIndex: item1.key,
                                                key: item1.key,
                                                align: 'center',
                                                ellipsis: true,
                                                width: 120,
                                                render: (text, record) => <a onClick={() => this.changeShow(text, record)}>{this.state.state[text]}</a>
                                            })
                                        } else {
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
                    this.columns.push({
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        ellipsis: true,
                        width: 120,
                        dataIndex: 'operation',
                        render: (text, record) =>
                            <a onClick={() => this.changeNew(text, record)}>更新</a>
                    })
                    this.columns = this.deteleObject(this.columns);
                })
                this.setState({
                    rows: res.data.rows,
                    total: res.data.total
                })
            }
        })
    }
    //分页改变
    onChange = page => {
        console.log(page);
        this.setState({
            current: page,
        }, () => {
            this.getData(this.state.current, 16);
        });
    }
    changeShow(text, record) {
        console.log('record', record);
        let uid = record.id;
        let source = record.source;
        let url = '/api.v1/admin/account/up-state';
        let method = 'post';
        let beel = false;
        let options = {
            uid: uid,
            source: source
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.getData(1, 16);
            }
        })
    }
    changeNew(text, record) {
        this.setState({
            showDate: true
        })
        let uid = record.id;
        let source = record.source;
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        let lastTime = year + month + date;
        this.setState({
            trade_date: lastTime,
            uid: uid,
            source: source
        })
        let url = '/api.v1/admin/account/trade-info';
        let method = 'post';
        let beel = false;
        let options = {
            uid: uid,
            source: source,
            trade_date: lastTime
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0 && res.data != null) {
                //balance权益，withdraw入金，deposit出金
                let data = res.data;
                this.setState({
                    balance: data.balance,
                    withdraw: data.withdraw,
                    deposit: data.deposit,
                    trade_date: moment(data.trade_date)
                })
            } else if (res.code === 0 && res.data == null) {
                this.setState({
                    balance: '',
                    withdraw: '',
                    deposit: '',
                    trade_date: moment(lastTime)
                })
            }
        })
    }
    getTimeChange() {
        let url = '/api.v1/admin/account/trade-info';
        let method = 'post';
        let beel = false;
        let options = {
            uid: this.state.uid,
            source: this.state.source,
            trade_date: moment(this.state.trade_date).format('YYYYMMDD')
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0 && res.data != null) {
                //balance权益，withdraw入金，deposit出金
                let data = res.data;
                this.setState({
                    balance: data.balance,
                    withdraw: data.withdraw,
                    deposit: data.deposit,
                    trade_date: moment(data.trade_date)
                })
            } else if (res.code === 0 && res.data == null) {
                this.setState({
                    balance: '',
                    withdraw: '',
                    deposit: '',
                    trade_date: moment(this.state.trade_date)
                })
            }
        })
    }
    gengxin() {
        let url = '/api.v1/admin/account/transform/trade-info';
        let method = 'post';
        let beel = false;
        let options = {
            uid: this.state.uid,
            source: this.state.source,
            trade_date: moment(this.state.trade_date).format('YYYYMMDD'),
            balance: this.state.balance,
            deposit: this.state.deposit,
            withdraw: this.state.withdraw
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.setState({
                    showDate: false
                })
                this.getData(1, 16);
            }
        })
    }
    qvxiao() {
        this.setState({
            showDate: false
        })
    }
    addU() {
        this.setState({
            showAdd: true
        })
    }
    addxin() {
        let url = '/api.v1/admin/account/add';
        let method = 'post';
        let beel = false;
        let options = {
            uid: this.state.uuid,
            nickname: this.state.uuname,
            source: this.state.uusource
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.setState({
                    showAdd: false
                })
                this.getData(1, 16);
            }
        })
    }
    addxiao() {
        this.setState({
            showAdd: false
        })
    }
    outout() {
        let url = '/logout';
        let method = 'post';
        let beel = false;
        let options = null;
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                localStorage.clear();
                this.props.history.push('/login');
            }
        })
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
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('是我啊', selectedRowKeys, selectedRows)
        this.setState({ selectedRowKeys, selectedRows });
        // this.setState({
        //     deleteUid: selectedRows[0].id,
        //     deleteSource: selectedRows[0].source
        // // })

        let arr = [];
        selectedRows.map(item => {
            arr.push({
                uid: item.id,
                source: item.source
            })

        })
        this.setState({
            deleteArr: arr
        }, () => {
            console.log('我是数组', this.state.deleteArr);
        })
    }
    deleteU() {
        let url = '/api.v1/admin/account/del';
        let method = 'post';
        let beel = false;
        let options = this.state.deleteArr;
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.getData(1, 16);
                this.setState({ deleteArr: '' })
            }
        })
    }
    render() {
        const { rows, total, showDate, trade_date, balance, withdraw, deposit, username, selectedRowKeys, showAdd, uuid, uuname, uusource } = this.state;
        const columns = this.columns;
        const dateFormat = 'YYYYMMDD';
        console.log('我是时间', trade_date)
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            /**
             * dataSource为数据数组
             * columns为表格的描述配置，列明什么之类的
             */
            <div>
                <div className="leftb">
                    <div className="toubox">
                        <img src={tou} />
                        <div className="loginout">
                            <div>{username}</div>
                            <div className="out" onClick={() => this.outout()}>退出</div>
                        </div>
                    </div>
                    <div className="userL">用户列表</div>
                </div>
                <div className="leftr">
                    <div className="caozuo">
                        <div onClick={() => this.addU()}>新增用户</div>
                        <div onClick={() => this.deleteU()}>删除用户</div>
                    </div>
                    {showDate == true ? <div className="topFix">
                        <div className="topForm">
                            <div className="topFTitle">更新数据<span className="closeX" onClick={() => this.qvxiao()}>X</span></div>
                            <Form
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                            >
                                <div className="padleft">
                                    <Form.Item label="日期选择 ">
                                        <DatePicker defaultValue={moment()} format={dateFormat} onChange={(trade_date) => this.setState({ trade_date }, () => {
                                            this.getTimeChange();
                                        })} />
                                    </Form.Item>
                                    <Form.Item label="当日权益 ">
                                        <Input value={this.state.balance} onChange={e => this.setState({ balance: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="当日出金 ">
                                        <Input value={this.state.withdraw} onChange={e => this.setState({ withdraw: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="当日入金 ">
                                        <Input value={this.state.deposit} onChange={e => this.setState({ deposit: e.target.value })} />
                                    </Form.Item>
                                </div>
                                <Form.Item className="toRight">
                                    <Button className='gen' onClick={() => this.gengxin()}>更新</Button>
                                    <Button className='qv' onClick={() => this.qvxiao()}>取消</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div> : ''}
                    {showAdd == true ? <div className="topFix">
                        <div className="topForm">
                            <div className="topFTitle">添加用户<span className="closeX" onClick={() => this.addxiao()}>X</span></div>
                            <Form
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                            >
                                <div className="padleft">
                                    <div style={{ height: '30px' }}></div>
                                    <Form.Item label="用户id ">
                                        <Input value={this.state.uuid} onChange={e => this.setState({ uuid: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="用户名称 ">
                                        <Input value={this.state.uuname} onChange={e => this.setState({ uuname: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="数据来源 ">
                                        <Input value={this.state.uusource} onChange={e => this.setState({ uusource: e.target.value })} />
                                    </Form.Item>
                                </div>
                                <Form.Item className="toRight">
                                    <Button className='gen' onClick={() => this.addxin()}>确认</Button>
                                    <Button className='qv' onClick={() => this.addxiao()}>取消</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div> : ''}
                    <div className="tableBox1">
                        <Table dataSource={rows} rowKey={record => record.id} rowSelection={rowSelection} columns={columns} size="small" scroll={{ y: 670 }} pagination={false} />
                        <div className="pagen">
                            <Pagination size="small" current={this.state.current} defaultPageSize={12} onChange={this.onChange} total={total} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;