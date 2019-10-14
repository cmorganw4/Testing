import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Chart } from 'primereact/chart';

import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Redirect } from 'react-router-dom'

import FileDownload from 'js-file-download';
import ReactDom from 'react-dom';
import logo from "../pic.png";

export class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            data: [], dates: [],
            user: localStorage.getItem("user"),
            accessToken: localStorage.getItem('Token'),
            colors: ['#3498DB', '#2ECC71', '#8E44AD', '#C0392B', '#F4D03F', '#1A5276']
        };
        axios.defaults.headers.common['Authorization'] = this.state.accessToken;
        this.setSelectedDate = this.setSelectedDate.bind(this);
    }

    componentWillMount() {
        axios.get('/api/dates').then(response => {
            this.setState({
                dates: response.data,
            });
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }
    updateProperty(property, value) {
        let item = this.state.subject;
        item[property] = value;
        this.setState({ subject: item });
    }

    setSelectedDate(value) {
        console.log(value.value);
        this.setState({
            selectedDate: value.value
        });
        const labels = [];
        const ret = [];
        axios.get('/api/dates/' + this.state.user + '/' + value.value).then(response => {
            this.setState({
                data: response.data,
            });
            const types = [];

            response.data.forEach(element => {
                var key = '';
                for (key in element) {
                    if (element.hasOwnProperty(key)) {
                        if (!labels.includes(key) && key === 'Dimension') {
                            labels.push(element[key]);
                        }
                        if (!types.includes(key) && key !== 'Dimension') {
                            types.push(key);
                        }

                    }

                }

            });
            const array = [];
            console.log(types);
            for (var key in types) {
                const littleArray = [];
                response.data.forEach(element => {
                    littleArray.push(element[types[key]]);
                });
                array.push(littleArray);
            }
            console.log(array);
            const datasets = [];
            var i = 0;
            for (var key in types) {
                if (types.hasOwnProperty(key)) {

                    if (array[key].length > 0)
                        datasets.push({
                            label: types[i],
                            data: array[i],
                            fill: false,
                            borderColor: this.state.colors[i]
                        })
                    i++;
                }

            }



            this.setState({
                graph: {
                    labels: labels,
                    datasets: datasets
                }
            })

            console.log('le graaphe', this.state.graph);
        }).catch(error => {
            console.log(error);
        })


    }

    render() {
        
        return (
            <div className="p-grid">

                <div className="p-col-12">
                    <div className="card">

                        <div className="content-section introduction">
                            <div className="feature-intro">
                                <h1>Dashboard</h1>
                            </div>
                        </div>
                        <br></br>
                        <Dropdown style={{ width: '30%' }} value={this.state.selectedDate} options={this.state.dates} onChange={(e) => { this.setSelectedDate(e) }} placeholder="Pick a date" />

                        <div className="content-section implementation flexgrid-demo">
                            {this.state.data.length > 0 &&
                                <>
                                    <br></br>
                                    <br></br>

                                    <div style={{ marginLeft: '15%', marginRight: '15%' }}>
                                        <div className="p-grid">
                                            <div className="p-col-4 p-offset-4" style={{ backgroundColor: '#EEE', padding: '1%', textAlign: 'center' }}>
                                                <div className="box">6</div>
                                            </div>
                                        </div>

                                        <div className="p-grid p-justify-between" style={{ marginTop: '1%' }}>
                                            <div className="p-col-3" style={{ backgroundColor: '#EEE', padding: '1%', textAlign: 'center' }}>
                                                <div className="box">3</div>
                                            </div>
                                            <div className="p-col-3" style={{ backgroundColor: '#EEE', padding: '1%', textAlign: 'center' }}>
                                                <div className="box">3</div>
                                            </div>
                                            <div className="p-col-3" style={{ backgroundColor: '#EEE', padding: '1%', textAlign: 'center' }}>
                                                <div className="box">3</div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br><br></br>
                                    <div className="p-grid p-justify-between">
                                        <div className="p-col-6">
                                            <div className="box" style={{ backgroundColor: '#EEE', padding: '1%', textAlign: 'center' }}>
                                                <DataTable value={this.state.data} responsive={true}
                                                    paginator={true} rows={15}>
                                                    <Column field="Dimension" header="Dimension" sortable={true} />
                                                    <Column field="CPAScore" header="CPAScore" sortable={true} />
                                                    <Column field="CPMScore" header="CPMScore" sortable={true} />
                                                    <Column field="CTRScore" header="CTRScore" sortable={true} />
                                                    <Column field="vCPMScore" header="vCPMScore" sortable={true} />
                                                    <Column field="CPCScore" header="CPCScore" sortable={true} />
                                                    <Column field="CRScore" header="CRScore" sortable={true} />

                                                </DataTable>
                                            </div>
                                        </div>
                                        <div className="p-col-6">
                                            <div className="box" style={{ backgroundColor: '#EEE', padding: '1%', textAlign: 'center' }}>
                                                {this.state.graph && <Chart height={'300%'} type="line" data={this.state.graph} />}

                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}
if (document.getElementById('Dashboard')) {
    ReactDom.render(<Dashboard />, document.getElementById('Dashboard'));
}