import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Redirect } from 'react-router-dom'

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


export class Users extends Component {

    constructor() {
        super();
        this.state = {
            user: localStorage.getItem("user"),
            data: [], item: {},
            accessToken: localStorage.getItem('Token')
        }
        //this.download = this.download.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.update = this.update.bind(this);


        axios.defaults.headers.common['Authorization'] = this.state.accessToken;

    }

    componentWillMount() {
        axios.get('/api/user/').then(response => {
            this.setState({
                data: response.data,
            });
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    actionTemplate(Column) {

        if (localStorage.getItem("role") == 2) {

        }
        if (localStorage.getItem("role") == 1) {

            return <div>
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={(e) => this.edit(Column.id)}></Button>
                <Button type="button" icon="pi pi-times" className="p-button-danger" style={{ marginRight: '.5em' }} onClick={this.delete.bind(Column)}></Button>
            </div>;

        }

    }

    edit(a) {
        axios.get('/api/users/' + a).then(response => {
            this.setState({
                item: response.data,
                visible2: true
            })
            console.log(this.state.item);
        }).catch(error => {
            console.log(error);
        })
    }

    update() {
        console.log(this.state.item);
        axios.put('/api/users/' + this.state.item.id, this.state.item).then(response => {
            console.log(this.state.item);
        }).catch(error => {
            console.log(error);
        })
    }

    updateProperty(property, value) {
        let item = this.state.item;
        item[property] = value;
        this.setState({ item: item });
    }

    delete() {
        axios.delete('/api/users/' + this.id).then(response => {
            let _users = this.state.data;
            this.state.data.forEach(element => {
                if(element.id === this.id) {
                    _users.pull(element);
                }
            });
            this.setState({
                data:_users
            })
            // console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }
   

    renderRedirect = () => {
        if (!localStorage.getItem("user") || !(localStorage.role !== 1)) {
            return <Redirect to='/login' />
        }
    }
    render() {
        var header = <div style={{ 'textAlign': 'center' }}>
            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="40" />
        </div>;
        return (
            <div className="p-grid">

                <div className="p-col-12">
                    <div className="card">

                        <div className="content-section introduction">
                            <div className="feature-intro">
                                <h1>Users</h1>
                            </div>
                        </div>

                        <br />

                        <div className="content-section implementation">


                            <Dialog header="Update user" visible={this.state.visible2} style={{ width: '25vw' }} modal={true} onHide={(e) => this.setState({ visible2: false })}>
                                <br />
                                <span className="p-float-label">
                                    <InputText id="first" value={this.state.item.firstName} onChange={(e) => this.updateProperty("firstName", e.target.value)} />
                                    <label htmlFor="first">First name</label>
                                </span>
                                <br />
                                <span className="p-float-label">
                                    <InputText id="last" rows={5} cols={50} value={this.state.item.lastName} onChange={(e) => this.updateProperty("lastName", e.target.value)} autoResize={true} />
                                    <label  id="last" htmlFor="last">Last name</label><br />
                                </span>
                                <br />

                                <span className="p-float-label">
                                    <InputText id="email" rows={5} cols={50} value={this.state.item.email} onChange={(e) => this.updateProperty("email", e.target.value)} autoResize={true} />
                                    <label id="email" htmlFor="email">Email</label><br />
                                </span>
                                <br />

                                <span className="p-float-label">
                                    <InputText type="password" id="password" rows={5} cols={50} value={this.state.item.password} onChange={(e) => this.updateProperty("password", e.target.value)} autoResize={true} />
                                    <label  id="password"  htmlFor="password">password</label><br />

                                </span>
                                <br />
                                <Button label="Update" icon="pi pi-info-circle" onClick={this.update} />

                            </Dialog>



                            <DataTable value={this.state.data} globalFilter={this.state.globalFilter} header={header} responsive={true}
                                paginator={true} rows={10} rowsPerPageOptions={[10, 20, 50]}>
                                <Column field="username" header="Username" style={{ width: '10em' }} sortable={true} />
                                <Column field="firstName" header="First Name" sortable={true} style={{ width: '10em' }} />
                                <Column field="lastName" header="Last Name" style={{ width: '10em' }} sortable={true} />
                                <Column field="email" header="Email" style={{ width: '20em' }} sortable={true} />
                                <Column header="Actions" body={this.actionTemplate} style={{ textAlign: 'center', width: '14em' }} />

                            </DataTable>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
