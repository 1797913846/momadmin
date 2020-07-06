//此为主页
import React from 'react';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import kline from './img/kline.png';
import './index.css';

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            username: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {

    }
    render() {
        const { username, textDom } = this.state;
        return (
            <div className="aboutBox">
                <div className="about">
                    <img src={kline} alt="" />
                    <div className="abouttext">
                        <div className="a1">MoM (Manager of Mangers) 模式也被称为精选多元管理人，通过优中选优的方法，筛选基金管理人或资产管理人，让这些最顶尖的专业人士来管理资产，而自身则通过动态地跟踪、监督、管理他们，及时调整资产配置方案，来收获利益。简而言之，MoM是找最优秀的投顾组成团队、分配资金、操盘投资，既发挥团队力量，又不限制个人风格。</div>
                        <div className="a2">&nbsp;&nbsp;&nbsp;&nbsp;叁元科技（量化）是由国内资深基金管理团队创立，打造MOM炒手网平台，长期招募优秀期货交易员、操盘手，从中挑选优秀盘手组建MOM多元化风格交易团队，以打造成国内顶级MOM基金为使命创立的。</div>
                        <div className="a3">&nbsp;&nbsp;&nbsp;&nbsp;产品在私募排排网公示</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;