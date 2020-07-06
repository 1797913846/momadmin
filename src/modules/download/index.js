//此为主页
import React from 'react';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            username: "",
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {

    }
    render() {
        const { username } = this.state;
        return (
            <div className="dbox">
                <div className="dsbox">
                    <div className="dstitle"><span>软件名称</span><span>软件说明</span><span>下载链接</span></div>
                    <div className="dcbox">
                        <div className="dd dimg"></div>
                        <div className="dd d1">知富VIP版快期交易软件</div>
                        <div className="dd d2">
                            <div>1.双击安装。</div>
                            <div>2.登录交易账号时，选择服务器：期货-核心八。</div>
                            <div>3.非交易时间，交易服务器在维护保养，交易账号登录不上，请在交易日8:30—16:00，20:30—3:00，这两个交易时间段登录账号。</div>
                        </div>
                        <div className="dd d3">下载</div>
                    </div>
                    <div className="dcbox">
                        <div className="dd dimg"></div>
                        <div className="dd d1">知富VIP版快期交易软件</div>
                        <div className="dd d2">
                            <div>1.双击安装。</div>
                            <div>2.登录交易账号时，选择服务器：期货-核心八。</div>
                            <div>3.非交易时间，交易服务器在维护保养，交易账号登录不上，请在交易日8:30—16:00，20:30—3:00，这两个交易时间段登录账号。</div>
                        </div>
                        <div className="dd d3">下载</div>
                    </div>
                    <div className="dcbox">
                        <div className="dd dimg"></div>
                        <div className="dd d1">知富VIP版快期交易软件</div>
                        <div className="dd d2">
                            <div>1.双击安装。</div>
                            <div>2.登录交易账号时，选择服务器：期货-核心八。</div>
                            <div>3.非交易时间，交易服务器在维护保养，交易账号登录不上，请在交易日8:30—16:00，20:30—3:00，这两个交易时间段登录账号。</div>
                        </div>
                        <div className="dd d3">下载</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;