import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import RegisterForm from './components/Register';
import StoreForm from './components/Store';
import Sidenavbar from './components/Sidenav';
import DashBoardForm from './components/Dashboard';
import IdeaStore from './components/Ideastore';
import VoteTable from './components/Vote';
import { IconContext } from "react-icons";



import './App.css';

const BasicExample = ({match}) => {
  debugger

  async function loggedIn() {
    let authenticity_token = localStorage.getItem('auth_token')

    if (authenticity_token != null){
    let data = {'authenticity_token': authenticity_token,'user_id': match.params.user_id}
    const res =await fetch(`http://127.0.0.1:8000/is_logged/`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    }).then((response) => {console.log(response) 
      return response})
    return res.status == 200 ? true : false}
  }

  let x = localStorage.getItem('auth_token')

  let logpart =''
  let registerpart = ''

  if ((x!= null) && (loggedIn())){
    logpart =             <li className="nav-item">
    <a  className="nav-link" href="/logout">Logout</a>
    </li>
  }
  else{
    logpart =             <li className="nav-item">
    <a  className="nav-link" href="/login">Login</a>
    </li>
    registerpart=       <li className="nav-item">
    <a  className="nav-link" href="/register">Register</a>
    </li>
  }
  return(
  <BrowserRouter >
  <Switch>
    <div>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">IOM</a>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a  className="nav-link" href="/register">Home</a>
            </li>
            {registerpart}
          {logpart}
          </ul>
        </div>
      </nav>
      <hr />
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Register}/>      
      <Route path="/logout" component={Logout}/>
      <Route exact path={'/user-iom/:user_id'} component={Usermain}/>
      <Route exact path={'/user-iom/:user_id/dashboard'} component={Usermain}/>
      <Route exact path={'/user-iom/:user_id/ideastore'} component={Usermain}/>
      <Route exact path={'/user-iom/:user_id/voting'} component={Usermain}/>

    </div>
    </Switch>
  </BrowserRouter>
)}

const Logout = ({match}) => {
  localStorage.removeItem('auth_token');
  return <Redirect to='/login' />

}

const Usermain = ({match}) => {
  let subcomp = ''
  debugger
  if (match.path.includes('dashboard')){
  subcomp = <DashBoardForm
    match = {match} />
  }
  if (match.path.includes('ideastore')){
    subcomp = <IdeaStore
      match = {match} />
    }
  if (match.path.includes('voting')){
    subcomp = <VoteTable
    match = {match} />
    }

  return(
  <div className = "row cold-container">
  <div className ="col-sm-2 bar-container">
  <Sidenavbar 
  match = {match} />
  </div>
  <div className ="col-sm-10 sub-comp-container">
  {subcomp}
  </div>

</div>
  )
}

const Register = ({match}) => (
  <div>
  <RegisterForm 
  match = {match} />
</div>
)

// const Dashboard = ({match}) => (
//   <div>
//   <DashBoardForm
//   match = {match} />
// </div>
// )
// const Sidebar = ({match}) => (
//   <div>
//   <Sidenavbar 
//   match = {match} />
// </div>
// )
export default BasicExample;    