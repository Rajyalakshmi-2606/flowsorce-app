import React from "react";
import ReactMarkdown from "react-markdown";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Pre from "./code-copy-btn";
import remarkGfm from "remark-gfm";
import classnames from "classnames";

import classes from "./style.module.css";
import { Table } from "react-bootstrap";

const CustomMarkDown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: Pre,
        a(props) {
          return (
            <a href={props.href} target="_blank" rel="noopener noreferrer">
              {props.children}
            </a>
          );
        },
        table({ children }) {
          return (
            <Table
              responsive
              striped
              bordered
              hover
              className="table-theme-blue"
            >
              {children}
            </Table>
          );
        },
        code({ node, className = "blog-code", children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              style={a11yDark as any}
              PreTag="div"
              language={match[1]}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className={classnames(
                { className: className },
                classes["code-bg"]
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default CustomMarkDown;
