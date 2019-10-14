import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginrequest: { username: '', password: '' },
        }
        this.login = this.login.bind(this);
    }


    updateProperty(property, value) {
        let item = this.state.loginrequest;
        item[property] = value;
        this.setState({ loginrequest: item });
    }


    login() {
        axios.post('/api/auth/signin', this.state.loginrequest).then(response => {
            if (response.data) {
                if (response.data.accessToken) {
                   // console.log(response.data.role[0].id);
                    localStorage.setItem('Token', response.data.accessToken);
                    console.log(response.data.user);
                    localStorage.setItem('user', response.data.user);
                    localStorage.setItem('role', response.data.role[0].id);
                    localStorage.setItem('showPanel', true);
                    axios.get('/api/auth/user/' + localStorage.getItem('user'), {
                        headers: {
                            Authorization: localStorage.getItem('Token'), //the token is a variable which holds the token
                        }
                    }).then(response => {
                        localStorage.setItem('username', response.data.username);
                        this.props.history.push({
                            pathname: '/',
                        });

                    }).catch(error => {
                        console.log(error);
                    })

                }
            } else {
                this.props.history.push('/');
            }
        }).catch(error => {
            console.log(error);
        })
    }
    renderRedirect = () => {
        if (localStorage.getItem("user")) {
            return <Redirect to='/' />
        }
    }
    render() {
        return (
            <div style={{background: 'linear-gradient(to right, #0388E5 0%, #07BDF4 100%)', height: '100%', paddingTop: '8%'}}>
                {this.renderRedirect()}
                <div style={{backgroundColor: 'white',  width: '40%', margin: 'auto', padding:'7%', borderRadius: 10}}>
                    <div>

                        <div>
                        <span className="p-float-label">
                            <InputText style={{width: '100%'}} id="login" value={this.state.loginrequest.username} onChange={(e) => this.updateProperty('username', e.target.value)} />
                            <label htmlFor="login">Username</label>
                        </span>
                        <br></br><br></br>
                        <span className="p-float-label">
                            <InputText style={{width: '100%'}} id="password"  type="password" value={this.state.loginrequest.password} onChange={(e) => this.updateProperty('password', e.target.value)} />
                            <label htmlFor="password">Password</label>
                        </span>
                        
                        <br></br><br></br>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: '50%'}}>
                            <Button style={{width: '55%'}} label="Login" onClick={this.login} />
                            <a href="/#/register" >Register</a>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}