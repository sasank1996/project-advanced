import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Register.css';




class RegisterForm extends Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleRedirect = this.handleRedirect.bind(this);
      this.handleSubmit1 = this.handleSubmit1.bind(this);
      this.handleRedirect1 = this.handleRedirect1.bind(this);

      this.state = {'url':''}
      if( this.props.match.url.includes("register")){
        this.state.url = '/register'
      }
      if( this.props.match.url.includes("login")){
        this.state.url = '/login'
      }
  
    }
    handleRedirect(res){
        console.log(res)
      debugger
      console.log(res['status'] === 201)
      if( res['status'] === 201 ){
        this.setState({redirect:true,'id':res['user_id']})
        localStorage.setItem('auth_token', res['token'])
      }else {
        console.log("bad")
        window.location.reload()
      }
  
    }
    handleRedirect1(res){
      if( res === 201 ){
        this.setState({redirect:true})
      }else {
        console.log("bad")
        window.location.reload()
      }
  
    }
    async  handleSubmit(event) {
      debugger
      event.preventDefault();
      debugger
      const data = new FormData(event.target);
       const data1 = await fetch(`http://127.0.0.1:8000${this.state.url}/`, {
        method: 'POST',
        body: data,
      }).then(function(response) {
        console.log('response',response)
        return response.json()
      }).then(function(data2) {
        console.log('data',data2)
        return data2
            });
            this.handleRedirect(data1)
    }

    async  handleSubmit1(event) {
      debugger
      event.preventDefault();
      debugger
      const data = new FormData(event.target);
       const data1 = await fetch(`http://127.0.0.1:8000${this.state.url}/`, {
        method: 'POST',
        body: data,
      }).then(function(response) {
        console.log('response',response)
        return response
      })
            this.handleRedirect1(data1.status)
    }
    
    render() { 
        let page_ui =''
        if  (this.state.url === '/register'){

      page_ui =   <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={this.handleSubmit1}>
          <div className="form-group">
            <label htmlFor="first_name">Enter First name: </label>
            <input id="first_name"  className="form-control" placeholder="Enter FirstName" name="first_name" type="text" />
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Enter Last name: </label>
            <input id="last_name"  className="form-control" placeholder="Enter LastName" name="last_name" type="text" />
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="username">Enter Username: </label>
            <input id="username"  className="form-control" placeholder="Enter UserName" name="username" type="text" />
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Enter your email: </label>
            <input id="email"  className="form-control" placeholder="Enter Email" name="email" type="email"/>
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input id="password"  className="form-control" placeholder="Password" name="password" type="password"/>
            <br/>
          </div>
          <button type="submit" className="btn btn-default">Register</button>
        </form>
        {this.state.redirect ? <Redirect to="/login"></Redirect> : null}
      </div>}
        if  (this.state.url === '/login'){
          debugger
          console.log("data ",this.state.id)
            page_ui=   <div className="register-container">
            <h2>Login</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Enter Username: </label>
                <input id="username"  className="form-control" placeholder="Enter UserName" name="username" type="text" />
                <br/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password: </label>
                <input id="password"  className="form-control" placeholder="Password" name="password" type="password"/>
                <br/>
              </div>
              <button type="submit" className="btn btn-default">Login</button>
            </form>
            {this.state.redirect ? <Redirect to={`user-iom/${this.state.id}`} ></Redirect> : <Redirect to="/login"></Redirect>}
          </div>
        }
      return (
        <div>
            {page_ui}
        </div>
      );
    }
  }
  export default RegisterForm;  