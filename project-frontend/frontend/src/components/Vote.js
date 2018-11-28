import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router'
import {BrowserRouter, Redirect } from 'react-router-dom';
import { IconContext } from "react-icons";
import Pagination from "react-js-pagination";


class VoteTable extends Component {
    constructor(props) {
        super(props);
        this.state = {'value': localStorage.getItem('auth_token') ,  todos: [], sodos: [], activePage: 1, perPage: 10, totalCount: 0, votesleft: 0,voted:false,redirect_to:0}  
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
            const todos = response_obj.store_data
            const totalCount = response_obj.total_count;
            const sodos = response_obj.voted_ideas
            const votesleft = response_obj.votes_left
            console.log('response_obj',response_obj)
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

    handleVote = async(e,store_id) => {
        let data = {'store_id' : store_id}
        const res =
        await fetch(`http://127.0.0.1:8000/user-iom/voting/${this.state.perPage}/${this.state.activePage}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.state.value
                }
        })
        console.log('sasa',res)
        if (res.status == 201){
            window.location.reload()
        }
        else{
          return <Redirect to='/login' />
        }
      }

       handlePageChange = async(pageNumber) => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/user-iom/voting/${this.state.perPage}/${pageNumber}`,{method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.state.value
          }})
          const response_obj = await res.json();
          console.log('response_obj_sasa', response_obj)
            const todos = response_obj.store_data
            const totalCount = response_obj.total_count;
            const sodos = response_obj.voted_ideas
            const votesleft = response_obj.votes_left
            console.log('response_obj',response_obj)
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

      handleRowClick =(event,id) =>{
        event.preventDefault()
        this.setState({redirect_to :id})
      }

    render(){
        var vote_array =[];
        this.state.sodos.map(vote =>(
            vote_array.push(vote.store_id)
        ))
        let table = ''
        let reee = ''
      let paginate = ''
            if (this.state.todos.length > 0){
              console.log('sadasda',this.state)
              paginate =       <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              />}
        table  =  <table className="table border ">
      <thead>
          <tr className ="text-center">
          <th scope="col">Employee Name</th>
          <th scope="col">Theme</th>
          <th scope="col">Application</th>
          <th scope="col">VoteCount</th>
          <th scope="col">Action</th>

          </tr>
      </thead>
          <tbody>
          

              {(this.state.todos.map(store => (

                  <tr class='clickable text-center' id = {`${store.id}`} onClick={(e,id) => this.handleRowClick(e,store.id)}>
                      <td >{store.user_id}</td>
                      <td class= "vote-ellipsis">{store.theme}</td>
                      <td class= "vote-ellipsis">{store.application}</td>
                      <td>{store.vote_count}</td>                     
                     {((this.state.votesleft <=0 )? (<td ><i className="side-nav-icon fas fa-poll red-tooltip" data-toggle="tooltip" data-placement="bottom" title="no votes left" style = {{cursor:'not-allowed',color:'gray'}} disabled></i></td>) :((vote_array.includes(store.id)) ? (<td ><i className="side-nav-icon fas fa-poll red-tooltip" data-toggle="tooltip" data-placement="bottom" title="Voted" style = {{cursor:'not-allowed',color:'red'}} disabled></i></td>) : (<td><i className="side-nav-icon fas fa-poll" data-placement="bottom" onClick={(e,store_id) => this.handleVote(e,store.id)} data-toggle="tooltip" title="Open" style = {{cursor:'pointer',color:'green'}}></i></td>)))}
                  </tr>
              )
              ))}
          </tbody>
         
      </table>
      let votesleft = this.state.votesleft
      let scut = this.state.todos.length >0 ? ''
       : (<div style = {{backgroundColor: 'darkgray', color : 'white', textAlign:"center", lineHeight:"40px"}}>NO RESULT TO DISPLAY</div>)
       reee = (this.state.redirect_to >0) ? (<Redirect to = {`ideaview/${this.state.redirect_to}`}></Redirect>) : ''

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
              {reee}
            </div>
            <div class ="text-center" style ={{backgroundColor:'lightgray', paddingTop:"15px",paddingBottom:"15px",fontSize:"20px", borderRadius:"10px", color:"gray"}} ><i class="fas fa-info-circle" data-toggle="tooltip" data-placement="top" title="You can do only these no of votes"></i>  votes left: {votesleft}</div>
            </div>
        )
    }

}

export default VoteTable;  