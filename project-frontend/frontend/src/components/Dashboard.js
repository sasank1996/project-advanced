import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';

class DashBoardForm extends Component {
    constructor(props) {
        super(props);
        this.state = {todos: '','value': localStorage.getItem('auth_token')} 
      }
      async componentWillMount(){
        const res = await fetch(`http://127.0.0.1:8000/user-iom/post_register`,
        {method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.value
        }
        }).then(function(response){
            return response.json()
        }).then(function(data2) {
            console.log('data',data2)
            return data2})
        this.setState({todos : res})
      }
    render() {
        let dash =   <div>             
            <div class = "dashboard-container">
            <h1 class= "dashboardheader">DashBoard</h1>
            </div>
        <div class ="row dashboard-body-container">
            <div class ="col dashboard-left-container">
            <h3>TotalVotes</h3>
            <span>{this.state.todos.total_votes}</span>
            </div>
            <div class ="col dashboard-right-container">
            <h3>VotesLeft</h3>
            <span>{this.state.todos.votes_left}</span>
            </div>
        </div>
        <div class = "sky-container">
        </div>
        </div>
        return(
            <div class="total-dash-container">
                {dash}
            </div>
        )
    }
}
export default DashBoardForm;  