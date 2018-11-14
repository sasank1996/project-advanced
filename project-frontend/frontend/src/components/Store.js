import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Store.css';

class StoreForm extends Component {
    render() {
        console.log(this.props.match)
        return(
            <div>{this.props.match.params.user_id}</div>
        )
    }
}
export default StoreForm;  