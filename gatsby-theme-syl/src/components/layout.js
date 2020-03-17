import React from 'react';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <header>gatsby-theme-syl</header>
      <main>{children}</main>
    </React.Fragment>
  );
};

export default Layout;
