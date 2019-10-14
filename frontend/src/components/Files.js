import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Redirect } from 'react-router-dom'

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


export class Files extends Component {

    constructor() {
        super();
        this.state = {
            user: localStorage.getItem("user"),
            data: [], idfile: '', item: {},
            categorie: '', description: '',
            accessToken: localStorage.getItem('Token')
        }
        this.uploadFile = this.uploadFile.bind(this);

        axios.defaults.headers.common['Authorization'] = this.state.accessToken;

    }

    componentWillMount() {
        axios.get('/api/docs/').then(response => {
            this.setState({
                data: response.data,
            });
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    componentDidUpdate() {
        axios.get('/api/docs/').then(response => {
            this.state.data= response.data
           
            // console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }
   
    updateProperty(property, value) {
        let item = this.state.item;
        item[property] = value;
        this.setState({ item: item });
    }

    uploadFile() {
        const formData = new FormData();
        formData.append('file', this.state.fichier)
        console.log(this.state.user);
        axios.post('/api/docs/' + this.state.user, formData, {
            headers: { 'Authorization': this.state.accessToken, 'Content-Type': 'multipart/form-data' }
        }
        )
        this.setState({
            visible: false
        })

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
                                <h1>Files</h1>
                                <Button label="New file" icon="pi pi-info-circle" onClick={(e) => this.setState({ visible: true })} />
                            </div>
                        </div>

                        <br />

                        <div className="content-section implementation">
                            <Dialog header="Nouveau document" visible={this.state.visible} style={{ width: '50vw' }} modal={true} onHide={(e) => this.setState({ visible: false })}>

                                <input className="p-button-text	" type="file" onChange={(e) => this.setState({ fichier: e.target.files[0] })} />
                                <Button label="Save" icon="pi pi-info-circle" onClick={this.uploadFile} />

                            </Dialog>

                            <DataTable value={this.state.data} globalFilter={this.state.globalFilter} header={header} responsive={true}
                                paginator={true} rows={10} rowsPerPageOptions={[10, 20, 50]}>
                                <Column field="nom" header="File Name" sortable={true} />
                                <Column field="user" header="Uploaded by" style={{ width: '20em' }} sortable={true} />

                                <Column field="date" header="Date" style={{ width: '20em' }} sortable={true} />
                            </DataTable>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
