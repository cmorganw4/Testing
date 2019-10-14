import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { Message } from 'primereact/message';
import { Redirect } from 'react-router-dom'

import axios from 'axios';

export class Register extends Component {

    constructor() {
        super();
        this.state = {
            signuprequest: { firstName: '', lastName: '', email: '', role: [], username: '', password: '', passwordconfirmation: '' },
            styleconfirmation: { width: '100%' },
            rolesSelectItems: [
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
            ],
            passwordmsg: true
        }
        this.register = this.register.bind(this);
        this.confirmpass = this.confirmpass.bind(this);
        this.handleroles = this.handleroles.bind(this);
        this.handlepassword = this.handlepassword.bind(this);
    }
    updateProperty(property, value) {
        let item = this.state.signuprequest;
        item[property] = value;
        this.setState({ signuprequest: item });
    }

    confirmpass(e) {
        this.updateProperty('passwordconfirmation', e.target.value);
        if (this.state.signuprequest.password) {
            if (this.state.signuprequest.password === this.state.signuprequest.passwordconfirmation) {
                this.setState({ styleconfirmation: { border: '2px solid green', width: '100%' } });
            } else this.setState({ styleconfirmation: { border: '2px solid red', width: '100%' } });
        }
    }

    renderRedirect = () => {
        if (localStorage.getItem("user")) {
            return <Redirect to='/dashboard' />
        }
    }

    register() {
        if (this.state.signuprequest.password.length < 7) {
            this.growl.show({ severity: 'error', summary: 'Erreur', detail: 'Mot de passe avec moins de 7 caractères' });
        }
        else {
            axios.post('/api/auth/signup', this.state.signuprequest).then(response => {
                if (response.data === "User registered successfully!") {
                    this.growl.show({ severity: 'success', summary: 'Succès', detail: 'Vous êtes inscrits vous pouvez vous connectez' });
                    this.props.history.push('/login');

                } else if (response.data.error === "username existe") {
                    this.growl.show({ severity: 'error', summary: 'Erreur', detail: 'Username déjà existant' });

                } else if (response.data.error === "email existe") {
                    this.growl.show({ severity: 'error', summary: 'Erreur', detail: 'Email déjà existant' });

                }
            }).catch(error => {
                console.log(error);
            })
        }
    }


    handlepassword(e) {
        this.updateProperty('password', e.target.value);
        if (this.state.signuprequest.password.length < 7)
            this.state.passwordmsg = false;
        else this.state.passwordmsg = true;
    }

    handleroles(e) {
        this.state.signuprequest.role = [];
        let _role;
        switch (e.target.value) {

            case 'admin':

                _role = this.state.signuprequest.role;
                _role.push('admin');
                this.setState({
                    signuprequest: _role,
                    selectedRole: 'admin'
                })
                break;

            case 'user':
                _role = this.state.signuprequest.role;
                _role.push('user');
                this.setState({
                    signuprequest: _role,
                    selectedRole: 'user'
                })

                break;

            default:

                break;

        }
    }

    render() {

        return (
            <div style={{ background: 'linear-gradient(to right, #0388E5 0%, #07BDF4 100%)', paddingBottom: '5%', paddingTop: '5%' }}>
                {this.renderRedirect()}

                <Growl ref={(el) => this.growl = el} />
                <div style={{ backgroundColor: 'white', width: '50%', margin: 'auto', borderRadius: 300 }}>

                    <div className="card">
                        <h1>Register</h1>
                        <div style={{ padding: '14%', paddingBottom: '9%', paddingTop: '5%' }}>
                            <label htmlFor="input">First Name</label>

                            <InputText style={{ width: '100%' }} value={this.state.signuprequest.firstNmae} onChange={(e) => this.updateProperty('firstName', e.target.value)} />
                            <br></br><br></br>

                            <label htmlFor="input">Last Name</label>

                            <InputText style={{ width: '100%' }} value={this.state.signuprequest.lastName} onChange={(e) => this.updateProperty('lastName', e.target.value)} />
                            <br></br><br></br>
                            <label htmlFor="input">Username</label>


                            <InputText style={{ width: '100%' }} value={this.state.signuprequest.username} onChange={(e) => this.updateProperty('username', e.target.value)} />
                            <br></br><br></br>
                            <label htmlFor="input">Email</label>


                            <InputText style={{ width: '100%' }} value={this.state.signuprequest.email} onChange={(e) => this.updateProperty('email', e.target.value)} />
                            <br></br><br></br>
                            <label htmlFor="input">Password</label>


                            <Password style={{ width: '100%' }} value={this.state.signuprequest.password} onChange={(e) => this.handlepassword(e)} />
                            <div hidden={this.state.passwordmsg}><Message severity="error" text="Minimum 7 caractères"></Message><br></br><br></br></div>

                            <br></br><br></br>
                            <label htmlFor="input">Password Confirmation</label>


                            <InputText style={this.state.styleconfirmation} type="password" value={this.state.signuprequest.passwordconfirmation}
                                onChange={(e) => this.confirmpass(e)} />
                            <br></br><br></br>

                            <label htmlFor="input">Role</label>

                            <Dropdown style={{ width: '100%' }} value={this.state.selectedRole} options={this.state.rolesSelectItems} onChange={(e) => { this.handleroles(e) }} placeholder="Pick a role" />
                            <br></br><br></br>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: '50%' }}>
                                <Button style={{ width: '50%' }} label="Register" onClick={this.register} />
                                <a href="/#/login">Back to Login</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}