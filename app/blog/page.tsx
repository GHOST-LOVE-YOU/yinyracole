import React from "react";

const BlogList = () => {
  const posts = [
    { id: "00-readme", title: "00 Readme" },
    { id: "01-start-from-js", title: "01 Start from JS" },
    { id: "02-understanding-jsx", title: "02 Understanding JSX" },
    { id: "03-expression-slots", title: "03 Expression Slots" },
    { id: "04-differences-from-html", title: "04 Differences from html" },
    { id: "05-the-whitespace-gotcha", title: "05 The Whitespace Gotcha" },
    { id: "06-jsx-vs-templates", title: "06 JSX vs. Templates" },
    { id: "07-components", title: "07 Components" },
    { id: "08-basic-syntax", title: "08 Basic Syntax" },
    { id: "09-props", title: "09 Props" },
    { id: "10-the-children-prop", title: " 10 The Children Props" },
    { id: "11-application-structure", title: "11 Application Structure" },
    { id: "12-fragments", title: "12 Fragments" },
    { id: "13-iteration", title: "13 Iteration" },
    { id: "14-mapping-over-data ", title: "14 Mapping Over Data " },
    { id: "15-keys", title: "15 Keys" },
    { id: "16-conditional-rendering", title: "16 Conditional Rendering" },
    { id: "17-with-an-if-statement", title: "17 With an If Statement" },
  ];

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <a href={`/blog/posts/${post.id}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default BlogList;
