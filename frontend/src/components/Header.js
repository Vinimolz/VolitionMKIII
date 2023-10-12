import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import  SearchBox from './SearchBox'
import { useNavigate } from 'react-router-dom'
function Header() {

  const userLogin = useSelector(state =>state.userLogin)
  const { userInfo } = userLogin

  const dispatch = useDispatch()
  const history = useNavigate();

  const logoutHandler = () => {
    history('/login')
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand="lg">
        <Container fluid>

          <LinkContainer to='/'>
            <Navbar.Brand style={{ padding: '50px' }} >Volition <span id='x-title'>X</span></Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="navbarScroll" />
          
          <Navbar.Collapse id="navbarScroll">
          
            <Nav
              className="me-auto my-2 my-lg-0 justify-content-center"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <LinkContainer to='/cart'>
                <Nav.Link><i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                </NavDropdown>

              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link><i className='fas fa-user'></i> Login</Nav.Link>
                </LinkContainer>   
              )} 

              {userInfo && userInfo.is_admin && (
                <NavDropdown title='Admin' id='adminmenue'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>

                </NavDropdown>
              )}   
              
            </Nav>
            <SearchBox />
          </Navbar.Collapse>
        </Container>
    </Navbar>
    </header>
  )
}

export default Header