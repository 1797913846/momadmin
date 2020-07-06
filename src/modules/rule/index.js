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
            account_id: "",
            balance: "",
            parent_account_name: "",
            parent_account_code: "",
            invite_count: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {

    }
    render() {
        const { username } = this.state;
        return (
            <div className='bgbox'>
                <div className='contentBox'>
                    <div className="text text1">MOM炒手网承诺，选拔和管理期内所有交易都为真实实盘，保证金中心可查。</div>
                    <div className="text text2">选拔交易品种</div>
                    <div className="text text3">国内5大期货交易所所有期货品种主力和次主力合约的选拔，股指期货、国债期货、原油期货均可以交易。</div>
                    <div className="text text4">MOM一段&nbsp;海选期</div>
                    <div className="text text5">操盘手出风险金，MOM炒手网提供助力资金，共同组建交易账户。当账户盈利超过10%，晋级成功，进入MOM二段；账户回撤超过20%则晋级失败，盘手在调整自身交易策略后可重新报名参与。该阶段账户的风险和收益均有盘手承担，期间出入金自由，成绩按比例折算。 组建账户注意事项：</div>
                    <div className="text text6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、如果你是交易新手请谨慎选择，想以交易为生并非易事。</div>
                    <div className="text text7">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、初始账户资金规模的大小会影响最终获得的管理型账户的资金规模，操盘手要根据自己资金实力选择合适的初始规模。MOM炒手网对初始账户规模没有任何限制，但建议盘手提供5000左右的风险金为宜，太小不利于仓位管理。</div>
                    <div className="text text8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、MOM炒手网提供最高风险金10倍的助力资金，盘手可自由选择，低杠杆对晋级有利。中长线交易策略选择3-5倍就够了，日内短线策略可适当提高杠杆。</div>
                    <div className="text text9">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、MOM炒手网提供的助力资金不参与利润分配也不承担亏损风险。</div>
                    <div className="text text10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5、MOM炒手网提供的助力资金不收取利息、管理费等，但会收取交易所2倍手续费。（如：交易所规定的手续费为10元，那我们则要另外加收10元，共计20元）。我们对交易频率没有要求，多收的手续费只为覆盖资金和运营成本，让我们共同的事业可持续发展。</div>
                    <div className="text text11">MOM二段 观察期</div>
                    <div className="text text12">盘手可申请账户资金翻翻。当账户盈利超过15%，晋级成功，进入MOM三段；账户回撤超过15%则晋级失败，退回MOM一段。该阶段账户的风险和收益均有盘手承担，期间出入金自由，成绩按比例折算。</div>
                    <div className="text text13">MOM三段 考核期</div>
                    <div className="text text14">盘手可申请账户资金翻翻。当账户盈利超过25%，晋级成功，获得三段同等规模的管理型账户；账户回撤超过10%则晋级失败，退回MOM二段。该阶段账户的风险和收益均有盘手承担，期间出入金自由，成绩按比例折算。</div>
                    <div className="text text15">MOM炒手管理期</div>
                    <div className="text text16">获得三段同等规模的管理型账户，每次累积盈利超过30%可申请账户资金翻翻。盈利超过10%部分可出金，分配比例30-70%；初始本金回撤达9%收回管理权限，退回MOM一段。该阶段账户的风险由MOM炒手网承担，账户盈利超过10%部分盘手可随时提取，10%部分用于防守，盘手决定放弃管理账户该部分获利后可分红。 </div>
                    <div className="biaoBox">
                        <div className="title">分红规则</div>
                        <div>
                            <table border="1" cellpadding="0" cellspacing="0" width="80%">
                                <tbody><tr>
                                    <th>累积获利</th>
                                    <th>MOM盘手提成</th>
                                </tr>
                                    <tr>
                                        <td>收益率≤20%</td>
                                        <td>30%（收益率20%以内)</td>
                                    </tr>
                                    <tr>
                                        <td>20%＜收益率≤50%</td>
                                        <td>40%（收益率20%-50%部分）</td>
                                    </tr>
                                    <tr>
                                        <td>50%＜收益率≤100%</td>
                                        <td>50%（收益率50%-100%部分）</td>
                                    </tr>
                                    <tr>
                                        <td>100%＜收益率≤200%</td>
                                        <td>60%（收益率100%-200%部分）</td>
                                    </tr>
                                    <tr>
                                        <td>收益率＞200%</td>
                                        <td>70%（收益率超过200%部分）</td>
                                    </tr>

                                </tbody></table>
                        </div>
                    </div>
                    <div className="text text17">其他</div>
                    <div className="text text18">1. 如遇有本规则未曾规定的情形或者有歧义之处，MOM炒手网拥有最终解释权。MOM炒手网不排除在实施过程中对本规则进行调整和修改。</div>
                    <div className="text text19">2. 本规则实施后，如发现存在重大漏洞或隐患，或者发生其他严重影响本MOM炒手网利益的情形的，MOM炒手网有权停止执行本规则。</div>
                </div>
            </div>
        );
    }
}

export default UserCenter;