import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Register.css';




class RegisterForm extends Component {
    constructor(props) {
      debugger
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleRedirect = this.handleRedirect.bind(this);
      this.handleSubmit1 = this.handleSubmit1.bind(this);
      this.handleRedirect1 = this.handleRedirect1.bind(this);

      this.state = {'url':'',fields: {},
      errors: {}
}
      if( this.props.match.url.includes("register")){
        this.state.url = '/register'
      }
      if( this.props.match.url.includes("login")){
        this.state.url = '/login'
      }
  
    }
    handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if(!fields["username"]){
         formIsValid = false;
         errors["username"] = "Cannot be empty";
      }

      if(typeof fields["username"] !== "undefined"){
         if(!fields["username"].match(/^[a-zA-Z]+$/)){
            formIsValid = false;
            errors["username"] = "Only letters";
         }        
      }
      
      if(!fields["email"]){
         formIsValid = false;
         errors["email"] = "Cannot be empty";
      }

      if(typeof fields["email"] !== "undefined"){
        if(!fields["email"].match(/(\W|^)[\w.+\-]*@ggktech\.com(\W|$)/ig)){
           formIsValid = false;
           errors["email"] = "email as ggkformat";  
        }        
     }

     if(!fields["password"]){
      formIsValid = false;
      errors["password"] = "Cannot be empty";
   }

   if(typeof fields["password"] !== "undefined"){
     if(!(fields["password"].lenght >= 8)){
        formIsValid = false;
        errors["password"] = "Password need minimum of 8 char";
     }        
  }
     this.setState({errors: errors});
     return formIsValid;
 }


    handleRedirect(res){
        console.log(res)
      debugger
      console.log(res['status'] === 201)
      if( res['status'] === 201 ){
        localStorage.setItem('auth_token', res['token'])
        this.setState({redirect:true,'id':res['user_id']})
      }else {
        console.log("bad")
        this.setState({redirect:false})
      }
  
    }
    handleRedirect1(res){
      if( res === 201 ){
        this.setState({redirect:true})
      }else {
        console.log("bad")
        this.setState({redirect:false})
      }
  
    }
      handleSubmit(event) {
      event.preventDefault();
      const data = new FormData(event.target);
      const data1 =  fetch(`http://127.0.0.1:8000${this.state.url}/`, {
        method: 'POST',
        body: data,
      }).then((response) =>{
        console.log('response',response)
        return response.json()
      }).then((data2) => {
        debugger
        console.log('data',data2)
        this.handleRedirect(data2)            });
            

    }

    async  handleSubmit1(event) {
      debugger
      event.preventDefault();
      debugger
      const data = new FormData(event.target);
      if(this.handleValidation()){
       const data1 = await fetch(`http://127.0.0.1:8000${this.state.url}/`, {
        method: 'POST',
        body: data,
      }).then(function(response) {
        console.log('response',response)
        return response
      })
            this.handleRedirect1(data1.status)}
      else{
        alert("Form has errors.")
      }
    }

    handleChange(field, e){         
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
  }

    
    render() { 
        let page_ui =''
        if  (this.state.url === '/register'){ 

      page_ui =   <div class="row"><div className="register-container">
        <h2 class="text-center" >Register</h2>
        <br/>
        <br/>
        <form onSubmit={this.handleSubmit1}>
          <div className="form-group">
            <label htmlFor="first_name">Enter First name: </label>
            <input ref ="first_name" id="first_name"  className="form-control" onChange={this.handleChange.bind(this, "first_name")} value={this.state.fields["first_name"]} placeholder="Enter FirstName" name="first_name" type="text" />
            <span className="error">{this.state.errors["first_name"]}</span>
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Enter Last name: </label>
            <input ref ="last_name" id="last_name"  className="form-control" onChange={this.handleChange.bind(this, "last_name")} value={this.state.fields["last_name"]} placeholder="Enter LastName" name="last_name" type="text" />
            <span className="error">{this.state.errors["last_name"]}</span>
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="username">Enter Username: </label>
            <input ref ="username" id="username"  className="form-control"  onChange={this.handleChange.bind(this, "username")} value={this.state.fields["username"]} placeholder="Enter UserName" name="username" type="text" />
            <span className="error">{this.state.errors["username"]}</span>
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Enter your email: </label>
            <input ref ="email" id="email"  className="form-control" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]} placeholder="Enter Email" name="email" type="email"/>
            <span className="error">{this.state.errors["email"]}</span>
            <br/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input ref ="password" id="password"  className="form-control" onChange={this.handleChange.bind(this, "password")} value={this.state.fields["password"]} placeholder="Password" name="password" type="password"/>
            <span className="error">{this.state.errors["password"]}</span>
            <br/>
          </div>
          <button type="submit" className="btn btn-default">Register</button>
        </form>
       </div>
       {this.state.redirect ? <Redirect to="/login"></Redirect> : null}
      
      <div class="vl"></div>
      <div class="main-description">
      <div class="text-content"> <h3 class="text-header">What You Can Do?</h3>
      <p><i class="fa fas fa-check" style={{color:'green',paddingRight:'10px'}}></i> register as a team to project innovative ideas </p>
      <p><i class="fa fas fa-check" style={{color:'green' ,paddingRight:'10px'}}></i> submit your idea to poll and skilet your project</p>
      <p><i class="fa fas fa-check" style={{color:'green' ,paddingRight:'10px'}}></i> lookthrough other ideas</p>
      <p><i class="fa fas fa-check" style={{color:'green' ,paddingRight:'10px'}}></i> vote and submit suggestions to ideas you like</p>
      <p><i class="fa fas fa-check" style={{color:'green' ,paddingRight:'10px'}}></i> win amazing prices at the end of the month</p>
      <p><i class="fa fas fa-check" style={{color:'green' ,paddingRight:'10px'}}></i> Now click register!</p>
      </div>
      </div>
        </div>}
        if  (this.state.url === '/login'){
          debugger
          console.log("data ",this.state.id)
            page_ui=   <div className="login-container">
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
            {(this.state.redirect) ? ((this.state.id == 1)? (<Redirect to='/admin/user-iom' ></Redirect>) : (<Redirect to='/user-iom' ></Redirect>) ): (<Redirect to="/login"></Redirect>)}
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