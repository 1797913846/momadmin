//主页面，首页
import React from 'react';
//二维码
import QRCode from 'qrcode.react';
import httpAxios from '../../helpers/request';
//导航
import { MENU } from '../../constants/menudata'
//图
import logoimg from './img/logoimg.png';
import logoname from './img/logoname.png';

//引入表格，布局，导航
import { Layout, Menu } from 'antd';
import { Link, Route, Redirect, Switch } from 'react-router-dom';

//引入路由页面
//主页
import home from '../home/index';
import rule from '../rule/index';
import download from '../download/index';
import zixun from '../zixun/index';
import see from '../see/index';
import about from '../about/index';
import k from '../k/index';
import A from '../list/index';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';

const { Content, Sider } = Layout;
class MainContent extends React.Component {
    /*constructor()中完成了React数据的初始化，它接受两个参数：props和context，当想在函数内部使用这两个参数时，需使用super()传入这两个参数。
注意：只要使用了constructor()就必须写super(),否则会导致this指向错误。*/
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            theme: "dark",
            current: "",
            username: '',
            qrUrl: '',
            qrUrl1: ''
        }
    }
    // componentWillMount()一般用的比较少，它更多的是在服务端渲染时使用。它代表的过程是组件已经经历了constructor()初始化数据后，但是还未渲染DOM时。
    componentWillMount = () => {

    }
    // 组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染
    componentDidMount = () => {
        let moren = this.props.location.pathname;
        this.setState({
            current: moren.substring(moren.lastIndexOf("/") + 1, moren.lenth) || '/'
        });
        this.props.history.listen((event) => {
            let test = event.pathname;
            let text = test.substring(test.lastIndexOf("/") + 1, test.length) || '/';
            this.setState({
                current: text
            });
        })
        let invite_code_desc = localStorage.getItem('invite_code_desc');
        let referral_code_desc = localStorage.getItem('referral_code_desc');
        let username = localStorage.getItem('username');
        this.setState({
            qrUrl: invite_code_desc,
            qrUrl1: referral_code_desc,
            username: username
        }, () => {
            console.log('图啊', this.state.username, this.state.invite_code_desc)
        });
    }
    // 在此处完成组件的卸载和数据的销毁。
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        let menuData = MENU;
        let menuDom = menuData.map((item, index) => (item.key != 'k' ? <Menu.Item key={item.key}>
            <Link to={item.path}><span>{item.name}</span></Link>
        </Menu.Item> : ''));
        let menuData1, routeDom;
        menuData1 = menuData.map((item, index) => {
            if (item.path == '/') {
                item.where = home
            } else if (item.path == '/rule') {
                item.where = rule
            } else if (item.path == '/download') {
                item.where = download
            } else if (item.path == '/zixun') {
                item.where = zixun
            } else if (item.path == '/see') {
                item.where = see
            } else if (item.path == '/about') {
                item.where = about
            } else if (item.path == '/k') {
                item.where = k
            } else {
                item.where = home
            }
            return item;
        })
        console.log('数组1', menuData1)
        let token = localStorage.getItem('token');
        routeDom = menuData1.map((item, index) => (
            (<Route exact path={item.path} component={item.where} key={item.key} />)
        ))
        return (<div>

            <Layout>
                <Layout>
                    <div></div>
                    <Layout>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0
                            }}
                        >
                            <Switch>
                                {routeDom}
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>);
    }
}

export default MainContent;