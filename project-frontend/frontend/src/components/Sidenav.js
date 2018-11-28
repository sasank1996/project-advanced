import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Sidenav.css';
import { SideNav, Chevron, Icon } from 'react-side-nav';
import {Link } from "react-router-dom";

class Sidenavigationbar extends Component {
    state = {bar_names : this.props.bar_names, bar_url : this.props.bar_url,bar_icons : this.props.bar_icons}

    
     menuItems = [
        { id: 1,
          label: 'Menu',
          icon: 'fas fa-bars',
          items: [
            { id: 11,
                label: this.state.bar_names['first'],
                icon: this.state.bar_icons['first'],
                link: this.props.bar_url['first'],
              },
            { id: 12,
              label: this.state.bar_names['second'],
              icon: this.state.bar_icons['second'],
              link: this.props.bar_url['second'],
            },
            { id: 13,
              label: this.state.bar_names['third'],
              icon: this.state.bar_icons['third'],
              link: this.props.bar_url['third'],
            },
            { id: 14,
                label: this.state.bar_names['fourth'],
                icon: this.state.bar_icons['fourth'],
                link: this.props.bar_url['fourth'],
              },
          ],
        },
      ];
      
       NavLink = props => (<Link to={props.to} {...props}><i className={`fa ${props.icon}`} />{props.label}</Link>);




    render() {
            return(
                <SideNav
                items={this.menuItems}
                linkComponent={this.NavLink}
                chevronComponent={Chevron}  
                iconComponent={Icon}
            />
    );
}
}
export default Sidenavigationbar;  