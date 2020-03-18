/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql, Link, useStaticQuery } from 'gatsby';

const TableOfContent = () => {
  const data = useStaticQuery(graphql`
    query {
      allDocsPage {
        nodes {
          id
          title
          path
        }
      }
    }
  `);

  const pages = data.allDocsPage.nodes;

  return (
    <div>
      <h2>Explore the Docs</h2>
      <ul>
        {pages.map(({ id, path, title }) => (
          <li key={id}>
            <Link
              to={path}
              activeClassName='active'
              sx={{
                '&.active': {
                  fontStyle: 'italic',
                  textDecoration: 'none',
                  '::after': {
                    content: '" (currently viewing)"'
                  }
                }
              }}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TableOfContent;
