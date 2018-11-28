import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import axios from 'axios';

class Ideaview extends Component {
    constructor(props){
        super(props);
        this.state ={idea_id : this.props.match.params.idea_id,'value': localStorage.getItem('auth_token'),store_data : ''}
    }
    async componentWillMount(){
        let headers= {
        'Content-Type': 'multipart/form-data',
         'charset':"UTF-8",
        'Authorization': this.state.value,
      }
        const res = await axios.get(`http://127.0.0.1:8000/user-iom/store/${this.props.match.params.idea_id}`,{headers:headers}).then(function(response) {return response.data})
        this.setState({store_data:res[0]})
        console.log(res)
    }
    render() {
        console.log('polo',this.state.store_data)
        return(
            <div><div class = "row" style={{border:'groove', marginLeft:'20px',marginRight:'20px'}}>
            <div class="col-sm-5" style={{border:'groove'}}><p><h3>Theme</h3></p><br/>{this.state.store_data.theme}</div>
            <div class="col-sm-5" style={{border:'groove'}}><p><h3>Application</h3></p><br/>{this.state.store_data.application}</div>
            <div class="col-sm-2" style={{border:'groove'}}><p><h3>File</h3></p><br/><a href={require('../assets/download.jpeg')}  class= "fas fa-file" download></a></div>
        </div></div>
        )
    }
}
export default Ideaview;  