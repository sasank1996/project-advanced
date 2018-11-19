import React from 'react';
import ReactDOM from 'react-dom';
import Appcore from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Appcore />, div);
  ReactDOM.unmountComponentAtNode(div);
});
