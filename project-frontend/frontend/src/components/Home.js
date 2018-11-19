import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Store.css';
import burgerLogo from '../assets/images/home.png';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {redirect:false}  
      }
    handleRedirect = () => {
        this.setState({redirect:true})
    }
    render() {
        let ree =''
        if (this.state.redirect){
         ree =         <Redirect to = "/register"></Redirect>
        }
        return(
            <div ><img src={burgerLogo} alt ='' class="bg-image" width="1855px"></img>
            <div class="bg-text" onClick={this.handleRedirect} >Register</div>
            {ree}
            </div>
        )
    }
}
export default Homepage;