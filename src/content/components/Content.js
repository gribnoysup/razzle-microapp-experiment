import React from 'react';
import { css } from 'emotion';

const ContentStyle = css`
  background-color: lightpink;
`;

const Content = props => (
  <div className={ContentStyle}>
    <h2>Content</h2>
    <p>This is microapp called "Content"</p>
    <p>It is rendered with React and styled with emotion</p>
  </div>
);

export default Content;
