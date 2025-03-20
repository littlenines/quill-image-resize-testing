import React, { useRef, useState } from 'react';
import Editor from './Editor';

const App = () => {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);

  const quillRef = useRef();

  return (
    <div style={{height: '600px'}}>
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
      />
      <div>
        <label>
          Read Only:{' '}
          <input
            type="checkbox"
            value={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength());
          }}
        >
          Get Content Length
        </button>
      </div>
      <div >
        <div >Current Range:</div>
        {range ? JSON.stringify(range) : 'Empty'}
      </div>
      <div >
        <div>Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
      </div>
    </div>
  );
};

export default App;
