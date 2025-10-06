import classNames from 'classnames';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you

import { preprocessLaTeX } from '@/utils/chat';
import styles from './index.less';

const HightLightMarkdown = ({
  children,
}: {
  children: string | null | undefined;
}) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      className={classNames(styles.text)}
      components={
        {
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <React.Suspense fallback={<div />}>
                {React.createElement(
                  React.lazy(async () => {
                    const mod = await import('react-syntax-highlighter');
                    return { default: mod.Prism } as any;
                  }),
                  { ...rest, PreTag: 'div', language: match[1] },
                  String(children).replace(/\n$/, ''),
                )}
              </React.Suspense>
            ) : (
              <code {...rest} className={`${className} ${styles.code}`}>
                {children}
              </code>
            );
          },
        } as any
      }
    >
      {children ? preprocessLaTeX(children) : children}
    </Markdown>
  );
};

export default HightLightMarkdown;
