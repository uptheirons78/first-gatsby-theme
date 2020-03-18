/** @jsx jsx */
import { jsx } from 'theme-ui';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from './layout';
import TableOfContent from './table-of-content';

const DocsPage = ({ page }) => {
  return (
    <Layout>
      <h1>{page.title}</h1>
      <MDXRenderer>{page.body}</MDXRenderer>
      <p
        sx={{
          borderTop: theme => `1px solid ${theme.colors.muted}`,
          color: 'muted',
          fontSize: 14,
          mt: 2,
          pt: 2
        }}
      >
        This page was updated {page.updated}.
      </p>
      <TableOfContent />
    </Layout>
  );
};

export default DocsPage;
