import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import titleCase from '@utilities/titleCase';

function Navigation(props) {
  const { routes, location: { pathname } } = props;

  let activeKey = pathname.split('/')[1];

  if (activeKey === '') {
    activeKey = '/';
  }

  const Links = () => {
    return routes.map((route, index) => (
      <Link key={index} to={`/${route}`} className="nav-link">
        <Nav.Link
          as="span"
          bsPrefix=""
          eventKey={route}
        >
          {titleCase(route)}
        </Nav.Link>
      </Link>
    ));
  }

  return (
    <Navbar variant="dark" bg="dark" expand="sm">
      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav">
        <Nav className="mr-auto" activeKey={activeKey}>
          <Links />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default withRouter(Navigation);
