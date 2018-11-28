import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import Pagination from "react-js-pagination";
import EmailModelPop from './Emailmodel';

class AdminUserIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {'value': localStorage.getItem('auth_token'),  todos: [], activePage: 1, perPage: 10, totalCount: 0,email : null}  
      }
  
      async componentWillMount() {
        try {
  
          const res = await fetch(`http://127.0.0.1:8000/admin/user-iom/userindex`,{
          method: 'GET',
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
                  
          const todos = res;
          console.log(todos)
          const totalCount = res;
  
          this.setState({
            todos,
            totalCount  
          });
        } catch (e) {
          console.log(e);
        }    
        console.log(this.state.todos)
  
      }
  
      async handlePageChange(pageNumber) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/admin/user-iom/userindex`,{method: 'GET',
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
      modalpop= (event) => {
        let id = event.target.id
       let  element = document.getElementById(id)
       let val = element.getAttribute('data-id')
       this.setState({
         email:val
       })
      }
      render() {
        let table = ''
        let paginate = ''
        let muf =''
        let i =0
              if (this.state.todos.length){
                paginate =       <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.perPage}
                totalItemsCount={this.state.totalCount}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
                />}
          table  =  <table className="table border css-serial">
        <thead>
            <tr className ="text-center">
            <th scope="col">S.No.</th>
            <th scope="col">Employee Name</th>
            <th scope="col">Employee Id</th>
            <th scope="col">Votes Left</th>
            <th scope="col">Total Votes</th>
            <th scope="col" >Email</th>  
            </tr>
        </thead>
            <tbody>
                {this.state.todos.map(store => {
                  i = i+1
                  return ( <tr className ="text-center">
                        <td><i class ="fas fa-user glow" aria-hidden="true" style ={{color:'green'}}></i></td>
                        <td class="indent">{store.user__first_name} {store.user__last_name}</td>
                        <td>{store.employee_id}</td>
                        <td>{store.votes_left}</td>
                        <td>{store.total_votes}</td>
                        <td><button  id ={`modal-pop-but ${i}`} class="fas fa-envelope" style ={{cursor:'pointer'}}  data-id = {store.user__email} onClick={(e) =>this.modalpop(e)} ></button></td>
                    </tr>)
                })
                }
            </tbody>
        </table>
         let scut = this.state.todos.length >0 ? ''
         : (<div style = {{backgroundColor: 'darkgray', color : 'white', textAlign:"center", lineHeight:"40px"}}>NO RESULT TO DISPLAY</div>)

         if(this.state.email != null){
           muf =  <EmailModelPop email = {this.state.email} />
        }
    
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
          <div >
            {muf}
          </div>
          
          </div>
        )}
  
}
export default AdminUserIndex;  