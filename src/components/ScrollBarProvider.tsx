import { CSSProperties, ReactNode, forwardRef, useEffect, useState } from 'react';
import { Scrollbar, Scrollbar as ScrollbarInstance } from 'react-scrollbars-custom';
import cn from 'classnames';
import { isUndefined } from 'lodash-es';

interface IProps {
  className?: string;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
  noScrollX?: boolean | undefined;
  noScrollY?: boolean | undefined;
  children: ReactNode;
}

const ScrollBarProvider = forwardRef<ScrollbarInstance, IProps>(
  ({ className, style, contentStyle, children, noScrollX, noScrollY }, ref) => {
    const [isReady, setIsReady] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      setIsReady(true);
    }, []);

    if (!isReady) return null;

    const visible = isHovered;

    return (
      <Scrollbar
        ref={ref as any}
        className={className ? cn('scroll_wrap', className) : 'scroll_wrap'}
        style={{
          ...style,
          height: style?.height || '100%',
          boxSizing: 'border-box',
        }}
        noScrollX={!isUndefined(noScrollX) ? noScrollX : true}
        noScrollY={!isUndefined(noScrollY) ? noScrollY : false}
        maximalThumbSize={200}
        removeTrackYWhenNotUsed={false}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        wrapperProps={{
          style: {
            width: '100%',
            overflow: 'hidden',
          },
        }}
        contentProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            ...contentStyle,
          },
        }}
        trackXProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 5,
                  background: 'transparent',
                }}
              />
            );
          },
        }}
        thumbXProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  backgroundColor: '#888',
                  borderRadius: 3,
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out',
                  height: '100%',
                }}
              />
            );
          },
        }}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 5,
                  background: 'transparent',
                }}
              />
            );
          },
        }}
        thumbYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  backgroundColor: '#888',
                  borderRadius: 3,
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out',
                  width: '100%',
                }}
              />
            );
          },
        }}
      >
        {children}
      </Scrollbar>
    );
  },
);

ScrollBarProvider.displayName = 'ScrollBarProvider';

export default ScrollBarProvider;
