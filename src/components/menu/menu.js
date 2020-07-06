import React from 'react'
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import Icon from '@ant-design/icons';
const menus = [
    {
        title: '首页',
        icon: 'page',
        key: '/'
    }, {
        title: '其它',
        icon: 'bulb',
        key: '/page/Other',
        subs: [
            { key: '/page/AlertDemo', title: '弹出框', icon: '' },
        ]
    },
];
//此组件的意义就是将数据抽离出来，通过传递数据去渲染
class CustomMenu extends React.Component {

    renderSubMenu = ({ key, icon, title, subs }) => {
        return (
            <Menu.SubMenu key={key} title={<span>{icon && <Icon type={icon} />}<span>{title}</span></span>}>
                {
                    subs && subs.map(item => {
                        return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    })
                }
            </Menu.SubMenu>
        )
    }
    renderMenuItem = ({ key, icon, title, }) => {
        return (
            <Menu.Item key={key}>
                <Link to={key}>
                    {icon && <Icon type={icon} />}
                    <span>{title}</span>
                </Link>
            </Menu.Item>
        )
    }
    render() {
        return (
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
            >
                {
                    menus.map(item => {
                        return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    })
                }
            </Menu>
        )
    }
}
export default CustomMenu
