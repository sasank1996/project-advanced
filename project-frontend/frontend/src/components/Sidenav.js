import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Sidenav.css';
import { SideNav, Chevron, Icon } from 'react-side-nav';
import {Link } from "react-router-dom";
class Sidenavbar extends Component {
  constructor()
     menuItems = [
        { id: 1,
          label: 'Menu',
          icon: 'fas fa-bars',
          items: [
            { id: 11,
                label: 'DashBoard',
                icon: 'fas fa-pencil-alt',
                link: `/user-iom/${this.props.match.params.user_id}/dashboard`
              },
            { id: 12,
              label: 'TeamView',
              icon: 'fab fa-users',
              link: `/user-iom/${this.props.match.params.user_id}/teamview`,
            },
            { id: 13,
              label: 'IdeaStore',
              icon: 'fas fa-lightbulb',
              link: `/user-iom/${this.props.match.params.user_id}/ideastore`,
            },
            { id: 14,
                label: 'Voting',
                icon: 'fas fa-vote-yea',
                link: `/user-iom/${this.props.match.params.user_id}/voting`,
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
export default Sidenavbar;  