import { useRef, useState } from 'react';
import Editor from './Editor';
import { Link } from 'react-router';

const App = () => {

  const quillRef = useRef();
  const [html, setHtml] = useState('');

  const handleShowHtml = () => {
    if (quillRef.current) {
      const rawHtml = quillRef.current.root.innerHTML;
      setHtml(rawHtml);
    }
  };

  return (
    <div style={{ height: '600px' }}>
      <Editor ref={quillRef} />
      <div>
        <Link to="/test-page">Another Page</Link>
      </div>

      <button onClick={handleShowHtml} style={{ marginTop: '1rem' }}>
        Show HTML
      </button>

      {html && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Rendered HTML Output</h3>
          <div
            style={{ border: '1px solid #ccc', padding: '10px' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
