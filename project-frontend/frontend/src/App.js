import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import RegisterForm from './components/Register';
import StoreForm from './components/Store';
import Sidenavigationbar from './components/Sidenav';
import DashBoardForm from './components/Dashboard';
import IdeaStore from './components/Ideastore';
import VoteTable from './components/Vote';
import HomePage from './components/Home';

import { IconContext } from "react-icons";
import './App.css';
import axios from 'axios';

class Loading extends Component {
  debugger
  render(){
    return(
      <div>loading</div>
    )
  }
}

const userAuthLoggedIn = () => {
  let authenticity_token = localStorage.getItem('auth_token')
  if (authenticity_token != null){
  let data = {'authenticity_token': authenticity_token}
  let headers= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('auth_token')
  }
  const res = axios.post('http://127.0.0.1:8000/is_logged/', JSON.stringify(data),{headers:headers}).then(response =>{return response})
  debugger
  return res.status
}}
let auth_token = localStorage.getItem('auth_token')

const PrivateRoute = ({ component: Component, ...rest}) => {debugger 
  let fera = userAuthLoggedIn()
  console.log(fera)
  return(
  <Route {...rest} render={props => 
    (localStorage.getItem('auth_token')
      ? (<Component {...props} />)
      : (<Redirect to='/login' />))
   } />
)};
class Appcore extends Component {

  //  loggedIn = async() => {
  //   let authenticity_token = localStorage.getItem('auth_token')

  //   if (authenticity_token != null){
  //   let data = {'authenticity_token': authenticity_token}
  //   const res =await fetch(`http://127.0.0.1:8000/is_logged/`, {
  //     method: 'POST',
  //     headers: {'Content-Type':'application/json'},
  //     body: JSON.stringify(data)
  //   }).then((response) => {console.log(response) 
  //     return response})
  //   return res.status == 200 ? true : false}
  // }  

  render() {  debugger
        return(
            <HeadBar/>
        )
    }
}  

const HeadBar = () => {
  debugger


  let x = localStorage.getItem('auth_token')

  let logpart =''
  let registerpart = ''

  if ((x!= null)){
    logpart = <li class="dropdown"><a className="dropdown-toggle nav-link" data-toggle="dropdown" href="#">MyAccount</a>
    <ul class="dropdown-menu ">
      <li class="drop-spec"><a href="/user-iom">Account</a></li>
      <li class="drop-spec"><a href="/settings" >Settings</a></li>
      <li class="drop-spec"><a href="/logout" >Logout</a></li>
    </ul>
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
              <a className="navbar-brand" href="/">IOM</a>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a  className="nav-link" href="/">Home</a>
              </li>
              {registerpart}
            {logpart}
            </ul>
          </div>
        </nav>
        <hr />
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Register}/>      
        <Route path="/logout" component={Logout}/>
        <Route path="/loading" component={Loading}/>
        <Route exact path="/" component={HomePage}/>


        <PrivateRoute exact path={'/user-iom'} component={Usermain}/>
        <PrivateRoute exact path={'/user-iom/dashboard'} component={Usermain}/>
        <PrivateRoute exact path={'/user-iom/ideastore'} component={Usermain}/>
        <PrivateRoute exact path={'/user-iom/voting'} component={Usermain}/>
        <PrivateRoute exact path={'/admin/user-iom'} component={Usermain}/>

      </div>
    </Switch>
  </BrowserRouter>
)}

const Logout = ({match}) => {
  localStorage.removeItem('auth_token');
  return <Redirect to='/login' />

}

const Usermain = ({match}) => {
  let comp = ''
  let subcomp = ''
  let bar_names = ''
  let bar_url = ''
  debugger
  if (match.path.includes('dashboard')){
  subcomp = <DashBoardForm
    match = {match} />
  }
  else if (match.path.includes('ideastore')){
    subcomp = <IdeaStore
      match = {match} />
    }
  else if (match.path.includes('voting')){
    subcomp = <VoteTable
    match = {match} />
  }
  if ((match.path.includes('user-iom')) && !(match.path.includes('admin'))){
    debugger
    bar_names = {'first':'DashBoard', 'second':'TeamView', 'third':'IdeaStore', 'fourth':'Voting'}
    bar_url = {'first':'/user-iom/dashboard', 'second':'/user-iom/teamview', 'third':'/user-iom/ideastore', 'fourth':'/user-iom/voting'}
    comp =  <Sidenavigationbar match={match} bar_names={bar_names} bar_url={bar_url} />

  }
  if ((match.path.includes('user-iom')) && (match.path.includes('admin'))){
    debugger
    bar_names = {'first':'DashBoard', 'second':'UserIndex', 'third':'Viewers And Voters', 'fourth':'Setting'}
    bar_url = {'first':'admin/user-iom/dashboard', 'second':'admin/user-iom/userindex', 'third':'admin/user-iom/viewersandvoters', 'fourth':'admin/user-iom/setting'}
    comp =  <Sidenavigationbar match={match} bar_names={bar_names} bar_url={bar_url} />

  }
  return (
    <div className = "row cold-container">
      <div className ="col-sm-2 bar-container">
      {comp}
      </div>
      <div className ="col-sm-10 sub-comp-container">
        {subcomp}
      </div>
    </div>
  )
}

const Register = ({match}) =>
 (
  <div>
    {localStorage.getItem('auth_token') != null ? <Redirect to="/user-iom" ></Redirect> : <RegisterForm 
    match = {match} />}
    
  </div>  
)

export default Appcore;    