import React, { Component } from 'react';
import classNames from 'classnames';
import logo from "./pic.png";
import { Redirect } from 'react-router-dom'


export class AppInlineProfile extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
        this.logout = this.logout.bind(this);

    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }

  logout(){
      localStorage.removeItem('user');
      localStorage.setItem('username', '');
      localStorage.setItem('token', 0);
      localStorage.setItem('showPanel',false);

  }

    render() {
        return  (
            <div className="profile">
                <div>
                    <img src={logo} alt="" />
                </div>
                <a className="profile-link" onClick={this.onClick}>
                    <span className="username">{localStorage.getItem('username')}</span>
                    <i className="pi pi-fw pi-cog"/>
                </a>
                <ul className={classNames({'profile-expanded': this.state.expanded})}>
                    <li><a href="/#/login" onClick={this.logout}><i className="pi pi-fw pi-power-off"/><span>Logout</span></a></li>
                </ul>
            </div>
        );
    }
}