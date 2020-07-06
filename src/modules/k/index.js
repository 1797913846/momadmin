//此为主页
import React from 'react';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import logoimg from './img/logoimg.png';
import leftimg from './img/leftimg.png';
import ReactEcharts from "echarts-for-react";
import echarts from 'echarts'
// import echarts from 'echarts/lib/echarts'
class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            username: "",
            uid: "",
            source: "",
            nickname: "",
            profit_percent: "",
            total_income_rate: "",
            count: '15',
            data: [],
            a: [],
            b: [],
            option: {}
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        let uid = localStorage.getItem('uid');
        let source = localStorage.getItem('source');
        let nickname = localStorage.getItem('nickname');
        let profit_percent = localStorage.getItem('profit_percent');
        let total_income_rate = localStorage.getItem('total_income_rate');
        console.log('没有', uid, source, nickname, profit_percent);
        this.setState({
            uid: uid,
            source: source,
            nickname: nickname,
            profit_percent: profit_percent,
            total_income_rate: total_income_rate
        }, () => {
            this.getK(this.state.uid, this.state.source, this.state.count);
        })

    }
    getK(uid, source, count) {
        if (!uid) {
            uid = ''
        }
        if (!source) {
            source = ''
        }
        if (!count) {
            count = ''
        }
        let url = '/api.v1/ranking/detail?uid=' + uid + '&source=' + source + '&count=' + count;
        let method = 'get';
        let beel = false;
        let options = null;
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.setState({
                    data: res.data
                }, () => {
                    let a = [], b = [];
                    this.state.data.map(item => {
                        a.push(item.trade_date);
                        b.push(item.profit_percent);
                    });
                    this.setState({
                        a: a,
                        b: b
                    }, () => {
                        console.log('b', this.state.b)
                        //取最大值和最小值
                        this.state.b.sort(function (a, b) {
                            return a - b;
                        });
                        let min = this.state.b[0];
                        let max = this.state.b[this.state.b.length - 1];
                        console.log(3333);
                        console.log('最大最小值', min, max);
                        var amplitude = max - min;   //鎸箙
                        var toFixedNum = 0;
                        if (amplitude < 0.12) {
                            toFixedNum = 3;
                        } else {
                            toFixedNum = 1;
                        }
                        var max_res = (max + 0.5 * Math.log(max) + 0.2 * (max - min)).toFixed(toFixedNum);
                        var min_res = (min - Math.abs(Math.log(min)) - .5 * (max - min)).toFixed(toFixedNum);
                        min_res = min_res <= 0 ? 0 : min_res;
                        // console.log(max,min)
                        // console.log(max_res,min_res)
                        if (max_res <= max) {
                            max_res = max.toFixed(3);
                        }
                        console.log('最小最大净值', min_res, max_res);
                        this.setState({
                            option: {
                                xAxis: {
                                    type: 'category',
                                    data: this.state.a
                                },
                                yAxis: {
                                    type: 'value',
                                    min: min_res,
                                    max: max_res,
                                },
                                series: [{
                                    data: this.state.b,
                                    type: 'line'
                                }],
                                lineStyle: {
                                    color: '#E88A0B' //改变折线颜色
                                }
                            }
                        }, () => {
                            console.log('option', this.state.option)
                        })
                    })
                })
            }
        })
    }
    render() {
        const { username, option, nickname, profit_percent, total_income_rate } = this.state;
        return (
            <div>
                <div className="topkbox">
                    <img src={logoimg} alt="" />
                    <div className="topk">
                        <div className='k1'>{nickname}</div>
                        <div className='k2'>
                            <span>累计净值：<span style={{ color: '#E88A0B' }}>{profit_percent}</span></span>
                            <span>累计收益率：<span style={{ color: '#E88A0B' }}>{total_income_rate}</span></span>
                        </div>
                    </div>
                </div>
                <div className='kbox'>
                    <div className='leftk'><img src={leftimg} />&nbsp;&nbsp;策略净值曲线</div>
                    <ReactEcharts option={option} />
                </div>
            </div>
        );
    }
}

export default UserCenter;