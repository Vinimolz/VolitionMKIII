import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer>
      <Container fluid className="bg-primary text-white">
        <Row>
            <Col className='text-center py-3' >Copyright &copy; Volition</Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
