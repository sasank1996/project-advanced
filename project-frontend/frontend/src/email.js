
import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Store.css';

class StoreForm extends Component {
    sendemail   = require('sendemail').email; // no api key
    email = sendemail.email;
    sendemail.set_template_directory('./template');
    
    person = {
    name : "Jenny",
    email: "babbu.sasank1996@gmail.com", // person.email can also accept an array of emails
    subject:"Welcome to DWYL :)"
    }
    
    email('welcome', person, function(error, result){
        console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ');
        console.log(result);
        console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    }
}
.post("send", {
url: 'api.mailjet.com', version: 'v3', perform_api_call: false
})
.request({  
    FromEmail: 'babbu.sasank1996@gmail.com',
    FromName: 'Mailjet Pilot',
    Subject: 'Hello world Mailjet!',
    'Text-part': 'Hello World',
    Recipients: [{'Email': 'sasank.thumati@ggktech.com'}]
})