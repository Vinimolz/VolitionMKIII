import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Loader  from '../components/Loader'
import Message  from '../components/Message'

import { listUsers, logout, deleteUser } from '../actions/userActions'

function UserListScreen() {

  const dispatch = useDispatch()
  const history = useNavigate();

  const userList = useSelector(state => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector(state => state.userDelete)   
  const { success:successDelete } = userDelete

  useEffect(() =>{
      if(userInfo && userInfo.is_admin){
        dispatch(listUsers())
      }else{
        history('/login')
        dispatch(logout())
      }
  },[dispatch], history, successDelete, userInfo)

  const deleteHandler = (id) => {
    if(window.confirm('Are you sure about this ?')){
      dispatch(deleteUser(id))
      window.location.reload();
    }
  }

  return (
    <div>
      <h1>
        Users list
      </h1>

      {loading  
        ? (<Loader />) 
        : error  
          ? (<Message variant='danger'>{error}</Message>)
          : (
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>

                      <td>{user.is_admin ? (
                        <i className='fas fa-check' style={{color: 'green'}}></i>
                      ) : (
                        <i className='fa-solid fa-x' style={{color: 'red'}}></i>
                      )}</td>

                      <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                          <Button variant='light' className='btn-sm'>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Button>
                        </LinkContainer>

                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                            <i className="fas fa-trash"></i>  
                          </Button>

                      </td>
                    </tr>

                  ))}
                </tbody>
              </Table>
        )}

    </div>
  )
}

export default UserListScreen
