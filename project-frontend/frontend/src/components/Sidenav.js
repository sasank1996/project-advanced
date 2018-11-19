import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Sidenav.css';
import { SideNav, Chevron, Icon } from 'react-side-nav';
import {Link } from "react-router-dom";

class Sidenavigationbar extends Component {
  constructor(props) {
    debugger
    super(props);
    debugger;
    this.state = {bar_names : props.bar_names, bar_url : props.bar_url}
  }
    
     menuItems = [
        { id: 1,
          label: 'Menu',
          icon: 'fas fa-bars',
          items: [
            { id: 11,
                label: this.state.bar_names['first'],
                icon: 'fas fa-pencil-alt',
                link: this.props.bar_url['first'],
              },
            { id: 12,
              label: this.state.bar_names['second'],
              icon: 'fab fa-users',
              link: this.props.bar_url['second'],
            },
            { id: 13,
              label: this.state.bar_names['third'],
              icon: 'fas fa-lightbulb',
              link: this.props.bar_url['third'],
            },
            { id: 14,
                label: this.state.bar_names['fourth'],
                icon: 'fas fa-vote-yea',
                link: this.props.bar_url['fourth'],
              },
          ],
        },
      ];
      
       NavLink = props => (<Link to={props.to} {...props}><i className={`fa ${props.icon}`} />{props.label}</Link>);




    render() {
      debugger
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