import React, { Component } from 'react';
import classNames from 'classnames';
import { AppMenu } from './AppMenu';
import { AppInlineProfile } from './AppInlineProfile';
import { Route } from 'react-router-dom';
import { Login } from './components/login';
import { Register } from './components/register';
import { Files } from './components/Files';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'fullcalendar/dist/fullcalendar.css';
import './layout/layout.css';
import './App.css';
import { AppTopbar } from './AppTopbar';
import { Dashboard } from './components/Dashboard';
import { Users } from './components/Users';
import { Redirect } from 'react-router-dom';

class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            layoutColorMode: 'light',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
        };

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this);

        this.createMenu();
    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }

        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {
        if (!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }
    }

    createMenu() {

        this.menu = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-calendar', command: () => { window.location = '#/' } },
            { label: 'Users', icon: 'pi pi-fw pi-calendar', command: () => { window.location = '#/users' } },
            { label: 'Files', icon: 'pi pi-fw pi-calendar', command: () => { window.location = '#/Files' } },

        ];

    }


    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }



    componentWillMount() {

        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    renderRedirect() {
        

        if (!localStorage.getItem("user"))
            return(
                <Redirect to='/login' />
            );
        
        console.log(this.props.history);
    }

    render() {
        let wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive
        });
        let sidebarClassName = classNames("layout-sidebar", { 'layout-sidebar-dark': this.state.layoutColorMode === 'dark' });


        return (

            <>{this.renderRedirect()}
                <div className={wrapperClass} onClick={this.onWrapperClick}>
                   
                    {localStorage.getItem("user") &&
                        <>
                            <AppTopbar onToggleMenu={this.onToggleMenu} />
                            <div className={sidebarClassName} onClick={this.onSidebarClick}>
                                <ScrollPanel ref={(el) => this.layoutMenuScroller = el} style={{ height: '100%' }}>
                                    <div className="layout-sidebar-scroll-content" >
                                        <div className="layout-logo">

                                        </div>
                                        <AppInlineProfile />
                                        <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                                    </div>
                                </ScrollPanel>
                            </div>


                            <div className="layout-main">
                                <Route path="/" exact component={Dashboard} />
                                <Route path="/users" component={Users} />
                                <Route path="/Files" component={Files} />

                            </div>
                        </>

                    }

                    <div className="layout-mask"></div>

                </div>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                
            </>
        );
    }
}

export default App;