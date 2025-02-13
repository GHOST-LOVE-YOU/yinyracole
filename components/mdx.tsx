import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { JSX } from "react";
import { highlight } from "sugar-high";
interface TableProps {
  data: {
    headers: string[];
    rows: (string | number)[][];
  };
}

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

interface CustomLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: React.ReactNode;
}

function CustomLink(props: CustomLinkProps) {
  const href = props.href;

  if (href.startsWith("/")) {
    return <Link {...props}>{props.children}</Link>;
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

type RoundedImageProps = Omit<ImageProps, "className"> & {
  overrideSrc?: string;
  alt: string; // 显式声明 alt 为必需属性
};

function RoundedImage({ alt, overrideSrc, ...imageProps }: RoundedImageProps) {
  return (
    <Image
      alt={alt} // 确保 alt 属性始终存在
      {...imageProps}
      src={overrideSrc || imageProps.src}
      className="rounded-lg"
    />
  );
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
}

function Code({ children, ...props }: CodeProps): JSX.Element {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

const components = {
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
};

export function CustomMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
