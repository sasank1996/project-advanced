import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Store.css';
import PropTypes from 'prop-types';
import mailjet from 'mailjet';
import { require } from 'requirejs-react-jsx';
import axios from 'axios';



class EmailModelPop extends Component { 
  constructor(props){
    super(props)
    this.state = {
        feedback: '',
        formSubmitted: false,
        value : localStorage.getItem('auth_token'),
        email : this.props.email,
        changed:false
      };
    
    }
      data = {
        'FromEmail': 'babbu.sasank1996@gmail.com',
        'FromName': 'Mailjet Pilot',
        'Subject': 'Your email flight plan!',
        'Text-part': 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
        'Html-part': '<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!',
        'Recipients': [{'Email':'sasank.thumati@ggktech.com'}]
    }
    modalclose = () =>{
      let  element = document.getElementById('emailmodal')
      element.classList.remove('show')


    }
        componentWillReceiveProps(){
          if (this.props.email != null){
          let  element = document.getElementById('emailmodal')
          element.classList.add('show')
          }
        }
        componentDidMount(){
          if (this.props.email != null){
          let  element = document.getElementById('emailmodal')
          element.classList.add('show')
          }
        }

    handleSubmit = (event) => {
        event.preventDefault()
        let headers= {
          'Content-Type': 'multipart/form-data',
           'charset':"UTF-8",
          'Authorization': this.state.value,
        }
        const data = new FormData(event.target);
         const data1 =  axios.post(`http://127.0.0.1:8000/sendemail/`, data,
         {headers:headers
       })  
       console.log(data1)   
       let  element = document.getElementById('emailmodal')
       element.classList.remove('show')
        this.setState({
          formSubmitted: true
        })
      }

    render() {
        return(
                <div class="modal-container">
                <div class="modal" id="emailmodal" role="dialog">
                    <div class="modal-dialog">
                    
                    <div class="modal-content">
                        <div class="modal-header row">
                        <div class="col-sm-11">
                        <h4 class="modal-title" style={{textAlign:'left'}}>Modal Header</h4>
                        </div>
                        <div class="col-sm-1">
                        <button type="button" style ={{margin:'0px', textAlign:'right'}} class="close" onClick ={() => this.modalclose()}>&times;</button>
                        </div>

                        </div>
                        <div class="modal-body">
                        <form className="feedback-form" id="emailform" onSubmit={ (e) => this.handleSubmit(e)}>
                            <div className="form-group">
                              <label htmlFor="application">Your Feedback : </label>
                            <textarea id="feedback-entry" placeholder = {this.props.email} className ="form-control" name="feedback-entry" type="text"/>
                          </div>
                          <div className="btn-group">
                        <button className="btn btn--cancel" onClick={this.handleClose}>
                        Cancel
                        </button>
                        </div>
                                            </form>
                        </div>
                        <div class="modal-footer">

                        <button type="button" class="btn btn-default" onClick ={() => this.modalclose()}>Close</button>
                        <input type="submit" form="emailform" />
                        </div>
                    </div>
                    
                    </div>
                </div>
                
                </div>
        )
    }
}
export default EmailModelPop;  