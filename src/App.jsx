import React, { useRef } from 'react';
import Editor from './Editor';
import { Link } from 'react-router';

const App = () => {

  const quillRef = useRef();

  return (
    <div style={{height: '600px'}}>
      <Editor ref={quillRef} />
      <div>
        <Link to="/test-page">Another Page</Link>
      </div>
    </div>
  );
};

export default App;
