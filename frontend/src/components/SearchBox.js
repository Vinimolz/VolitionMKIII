import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const history = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if(keyword){
        history(`/?keyword=${keyword}`);
    } else {
        history({search: ''})
    }
  };

  return (
    <Form onSubmit={submitHandler} className='Vini-search-box '>
      <Form.Control
        placeholder='All shoes'
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        className='mr-sm-2 ml-sm-5' // Remove the ml-sm-5 class
      />
      <Button type='submit' variant='outline-info' className='p-2'>
        Search
      </Button>
    </Form>
  );
}

export default SearchBox;
