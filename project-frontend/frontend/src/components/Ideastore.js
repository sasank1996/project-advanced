import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import './Ideastore.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Pagination from "react-js-pagination";
import FlashMessage from 'react-flash-message'
import axios from 'axios';
import Select from 'react-select';

class IdeaStore extends React.Component {
    constructor() {
        super();
        this.state = { tabIndex: 0 , 'value': localStorage.getItem('auth_token')};
      }
      render() {
        return (
          <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            <TabList>
              <Tab>IdeaForm</Tab>
              <Tab>IdeaTable</Tab>
            </TabList>
            <TabPanel><IdeaForm /></TabPanel>
            <TabPanel><IdeaTable /></TabPanel>
          </Tabs>
        );
      }
  }
  class IdeaForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {'value': localStorage.getItem('auth_token'),users_list:[],options:[],process:''}  
    }
 

    
    async componentWillMount() {
      try {
        
       let headers= {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.value
        }

        const res = await axios.get(`http://127.0.0.1:8000/user-iom/store/create/}`,{
                headers:headers
                }).then(function(response) {return response.data})
        const users_list = res
        this.setState({
          users_list  
        });
      } catch (e) {
        console.log(e);
      }    

    }


 logChange = (value) => {
  this.setState({process:value});
}
 



    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let file =document.querySelector('#datafile')
        data.set('file',file)
        let headers= {
          'Content-Type': 'multipart/form-data',
           'charset':"UTF-8",
          'Authorization': this.state.value,
        }
        axios.post(`http://127.0.0.1:8000/user-iom/store/create/`,
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
      let options =[]
      this.state.users_list.map(store =>(
        options.push({'value':store.email,'label':store.email})
      ))
      console.log('options',options)
      let mur =''
      if (options.length > 0){
        mur =              <Select
        value = {this.state.process}
        name="filter__statistics"
        options={options}
        onChange={this.logChange}
        isMulti ={true}
        isSearchable = {true}
        className = "select-check"
        placeholder = "select team mates..."
      /> 
      }
      return(
            <div className="container">
            <div>
              <h3> Add New Idea</h3>
            <form onSubmit={ (e) => this.handleSubmit(e)}>
                <div className="form-group">
                <label htmlFor="team_name">Team Name : </label>
                <input type="team_name" className="form-control" id="team_name" placeholder="Enter Team Name" name="team_name"/>
                </div>
                <div className="form-group">
                <label htmlFor="manager_name">Manager Name : </label>
                <input id="manager_name" className="form-control" placeholder="Enter Manager Name" name="manager_name" type="text"/>
                </div>
                <div className="form-group">
                <label htmlFor="theme">Theme / Idea : </label>
                <textarea id="theme" className="form-control" placeholder="Enter Idea" name="theme" type="text"/>
                </div>
                <div className="form-group">
                <label htmlFor="application">Application / Uses : </label>
                <textarea id="application" className ="form-control" placeholder="Enter Applications" name="application" type="text"/>
                </div>
                <label htmlFor="application">Team : </label>
                <div className="form-group">
                {mur}
                </div>

                <div className="form-group">
                <label htmlFor="application">Data File:  </label>
                <input id="datafile" type="file"  name="datafile"/>
                </div>


                <button type="submit" className="btn btn-default">Submit</button>
            </form>
            </div>
        </div>  
        )
    }
  }
  class IdeaTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {'value': localStorage.getItem('auth_token'),  todos: [], activePage: 1, perPage: 10, totalCount: 0}  
    }

    async componentDidMount() {
      try {
        

        const res = await fetch(`http://127.0.0.1:8000/user-iom/store/${this.state.perPage}/${this.state.activePage}`,{
        method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.state.value
                }
                })
        const response_obj = await res.json();
        const todos = response_obj.store_data
        const totalCount = response_obj.total_count;

        this.setState({
          todos,
          totalCount  
        });
      } catch (e) {
        console.log(e);
      }    
      console.log(this.state.todos)

    }

     handlePageChange = async(pageNumber) => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/user-iom/store/${this.state.perPage}/${pageNumber}`,{method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.value
        }})
        const response_obj =  await res.json();
        const todos = response_obj.store_data
        const totalCount = response_obj.total_count;

        this.setState({
          todos,
          totalCount,
          activePage: pageNumber,
          perPage: this.state.perPage
        });
      } catch (e) {
        console.log(e);
      }    
      console.log("fer")

      console.log(this.state.todos)
    }


    render() {
      let table = ''
      let paginate = ''
            if (this.state.todos.length){
              paginate =       <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              />}
        table  =  <table className="table border" style={{overflow:'hidden'}}>
      <thead>
          <tr className ="text-center">
          <th scope="col">Employee Name</th>
          <th scope="col">Team Name</th>
          <th scope="col">Manager Name</th>
          <th scope="col">Theme</th>
          <th scope="col" >Application</th>
          <th scope="col" >Votes</th>
          <th scope="col" >File</th>

          </tr>
      </thead>
          <tbody>
              {this.state.todos.map(store => (
                  <tr className ="text-center">
                      <td>{store.user_id}</td>
                      <td>{store.team_name}</td>
                      <td>{store.manager_name}</td>
                      <td>{store.theme}</td>
                      <td>{store.application}</td>
                      <td>{store.vote_count}</td>
                      <td><a href={require('../assets/download.jpeg')}  class= "fas fa-file" download></a></td>

                  </tr>
              )
              )}
          </tbody>
      </table>
       let scut = this.state.todos.length >0 ? ''
       : (<div style = {{backgroundColor: 'darkgray', color : 'white', textAlign:"center", lineHeight:"40px"}}>NO RESULT TO DISPLAY</div>)
  
      return(
        <div className="container">
        <div>
          {paginate}
        </div>
        <div >
          {table}
        </div>
        <div >
          {scut}
        </div>
        </div>
      )}
  }



  
export default IdeaStore;  