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
            <div className="ifbox">
                <iframe id="iframe" height="1000px" width="1000px" scrolling="auto" seamless="seamless" border='0' src="http://www.xuetz.com/web_share/white/7X24.jsp?auth=fc0b3d8fcef907d25954e7261b538958" frameborder="0"></iframe>
                {/* <iframe id="iframe" height="1000px" width="1000px" scrolling="auto" seamless="seamless" border='0' src="http://47.102.151.13:8195/news" frameborder="0"></iframe> */}
            </div>
        );
    }
}

export default UserCenter;