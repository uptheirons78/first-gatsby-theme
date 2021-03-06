const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const withDefault = require('./utils/default-options');

exports.onPreBootstrap = ({ store }, options) => {
  const { program } = store.getState();
  const { contentPath } = withDefault(options);
  const dir = path.join(program.directory, contentPath);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
};

/**
 * Schema Customization
 */
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type DocsPage implements Node @dontInfer {
      id: ID!
      title: String!
      path: String!
      updated: Date! @dateformat
      body: String!
    }
  `);
};

/**
 * Create Nodes
 */
exports.onCreateNode = ({ node, actions, getNode, createNodeId }, options) => {
  const { basePath } = withDefault(options);
  const parent = getNode(node.parent);

  if (node.internal.type !== 'Mdx' || parent.sourceInstanceName !== 'gatsby-theme-syl') {
    return;
  }
  // treat 'index.mdx' as 'index.html'
  const pageName = parent.name !== 'index' ? parent.name : '';

  actions.createNode({
    id: createNodeId(`DocsPage-${node.id}`),
    title: node.frontmatter.title || parent.name,
    updated: parent.modifiedTime,
    path: path.join('/', basePath, parent.relativeDirectory, pageName),
    parent: node.id,
    internal: {
      type: 'DocsPage',
      contentDigest: node.internal.contentDigest
    }
  });
};

/**
 * Custom Resolvers
 */
exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    DocsPage: {
      body: {
        type: 'String!',
        resolve: (source, args, context, info) => {
          const type = info.schema.getType('Mdx');
          const mdxFields = type.getFields();
          const resolver = mdxFields.body.resolve;
          const mdxNode = context.nodeModel.getNodeById({ id: source.parent });

          return resolver(mdxNode, args, context, {
            fieldName: 'body'
          });
        }
      }
    }
  });
};

/**
 * Create Pages
 */
exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    query {
      allDocsPage {
        nodes {
          id
          path
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic('error loading docs', result.errors);
  }

  const pages = result.data.allDocsPage.nodes;

  pages.forEach(page => {
    actions.createPage({
      path: page.path,
      component: require.resolve('./src/templates/docs-page-template.js'),
      context: {
        pageID: page.id
      }
    });
  });
};
