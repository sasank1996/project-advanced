import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import axios from 'axios';

class AdminSettingsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {'value': localStorage.getItem('auth_token'),settings_data:'',value0:'',value1 :'', value2 :'',value3 :'',value4 :'' }  
      }
    async  componentWillMount(){
        let headers= {
            'Content-Type': 'multipart/form-data',
             'charset':"UTF-8",
            'Authorization': this.state.value,}
        const res = await axios.get(`http://127.0.0.1:8000/admin/user-iom/settings`,
          {headers:headers}).then(function(response) {return response.data})
      this.setState({settings_data:res[0],
                    value0:res[0].vote_count,
                    value1 :res[0].start_date,
                    value2 :res[0].end_date,
                    value3 :res[0].file_size,
                    value4 :res[0].voters_count})


    }
    handleChange = (event) => {
        if (event.target.id == 'Votes_per_user'){
            this.setState({value0: event.target.value});}
        if (event.target.id == 'start_date'){
            this.setState({value1: event.target.value});}
        if (event.target.id == 'end_date'){
            this.setState({value2: event.target.value});}
        if (event.target.id == 'file_size'){
            this.setState({value3: event.target.value});}
        if (event.target.id == 'total_voters'){
            this.setState({value4: event.target.value});}
      }

      handleSubmit = (event) => {
          event.preventDefault();
          const data = new FormData(event.target);
          let headers= {
            'Content-Type': 'multipart/form-data',
             'charset':"UTF-8",
            'Authorization': this.state.value,
          }
          axios.post(`http://127.0.0.1:8000/admin/user-iom/settings`,
          data,
            {headers:headers
          }).then(this.handleRedirect)
        }
        handleRedirect(res){
          console.log(res.status)
          if( res.status === 201 ){ 
              window.location.reload()
              }else {
            // Something went wrong here
              }
          }
  
      render(){
          return(
              <div style={{ width:'840px'}} className="container">
              <div style={{padding:'20px'}} >
                <h3 class="fas fa-cog" style={{marginBottom:'30px'}}> Application Settings</h3>
              <form onSubmit={ (e) => this.handleSubmit(e)}>
                  <div className="form-group">
                  <label htmlFor="Votes_per_user">Votes/user : </label>
                  <input type="number" className="form-control" id="Votes_per_user" placeholder="Votes per user" name="Votes_per_user" value={this.state.value0} onChange={(e) => this.handleChange(e)} />
                  </div>
                  <div className="form-group">
                  <label htmlFor="start_date">Start Date </label>
                  <input id="start_date" className="form-control" name="start_date" type="datetime-local"  value={this.state.value1} onChange={(e) => this.handleChange(e)}/>
                  </div>
                  <div className="form-group">
                  <label htmlFor="end_date">End Date : </label>
                  <input id="end_date" className="form-control" name="end_date" type="datetime-local" value={this.state.value2} onChange={(e) => this.handleChange(e)} />
                  </div>
                  <div className="form-group">
                  <label htmlFor="file_size">File Size : </label>
                  <input id="file_size" className ="form-control" placeholder="File size" name="file_size" type="number" value={this.state.value3} onChange={(e) => this.handleChange(e)}/>
                  </div>
                  <div className="form-group">
                  <label htmlFor="total_voters">Voters:  </label>
                  <input id="total_voters" className ="form-control" type="number"  placeholder="number of voters" name="total_voters" value={this.state.value4} onChange={(e) => this.handleChange(e)} />
                  </div>
                  <button type="submit" className="btn btn-default">Submit</button>
              </form>
              </div>
          </div>  
          )
      }
}
export default AdminSettingsForm;  