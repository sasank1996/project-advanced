import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import { IconContext } from "react-icons";
import Pagination from "react-js-pagination";


class VoteTable extends Component {
    constructor(props) {
        super(props);
        this.state = {'value': localStorage.getItem('auth_token') ,  todos: [], sodos: [], activePage: 1, perPage: 10, totalCount: 0, votesleft: 0}  
      }
      setRedirect = () => {
        this.setState({
          redirect: true
        })
      }
      renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/login' />
        }
      }
    async  componentWillMount(){
        try {
            debugger
            const res = await fetch(`http://127.0.0.1:8000/user-iom/voting/${this.state.perPage}/${this.state.activePage}`,{
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.state.value
                }
              })
              if (res.status == 401) {
                this.setRedirect()
              }
            const response_obj = await res.json();
            debugger
            const todos = response_obj.store_data
            const totalCount = response_obj.total_count;
            const sodos = response_obj.voted_ideas
            const votesleft = response_obj.votes_left
    
            this.setState({
              todos,
              totalCount,
              sodos,
              votesleft
            });
          } catch (e) {
            console.log(e);
          }  
      }

    handleVote = (e,store_id) => {
        debugger
        let data = {'store_id' : store_id}
        const res =
        fetch(`http://127.0.0.1:8000/user-iom/voting/${this.state.perPage}/${this.state.activePage}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.state.value
                }
        })
        if (res.status == 201){
            window.location.reload()
        }
        else{
          return <Redirect to='/login' />
        }
      }

    

    render(){
        var vote_array =[];
        this.state.sodos.map(vote =>(
            vote_array.push(vote.store_id)
        ))
        let table = ''
      let paginate = ''
            if (this.state.todos.length > 0){
              paginate =       <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              />}
        table  =  <table className="table border">
      <thead>
          <tr className ="text-center">
          <th scope="col">Employee Name</th>
          <th scope="col">Theme</th>
          <th scope="col">VoteCount</th>
          <th scope="col">Action</th>

          </tr>
      </thead>
          <tbody>
          

              {(this.state.todos.map(store => (
                  <tr className ="text-center">
                      <td>{store.user_id}</td>
                      <td>{store.theme}</td>
                      <td>{store.vote_count}</td>                     
                     {((vote_array.includes(store.id)) ? (<td ><i className="side-nav-icon fas fa-poll" style = {{cursor:'not-allowed',color:'red'}} disabled></i></td>) : (<td><i className="side-nav-icon fas fa-poll" onClick={(e,store_id) => this.handleVote(e,store.id)} style = {{cursor:'pointer',color:'green'}}></i></td>))}
                  </tr>
              )
              ))}
          </tbody>
         
      </table>
      let scut = this.state.todos.length >0 ? ''
       : (<div style = {{backgroundColor: 'darkgray', color : 'white', textAlign:"center", lineHeight:"40px"}}>NO RESULT TO DISPLAY</div>)
        return(
            <div className="container">
            {this.renderRedirect()}
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
        )
    }

}

export default VoteTable;  