import * as React from 'react';
import { cn } from '@web/lib/utils';

const ScrollShadow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hideScrollBar?: boolean }
>(({ className, children, hideScrollBar = false, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isTopShadowVisible, setTopShadowVisible] = React.useState(false);
  const [isBottomShadowVisible, setBottomShadowVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setTopShadowVisible(scrollTop > 0);
      setBottomShadowVisible(scrollTop + clientHeight < scrollHeight);
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn('relative')} {...props}>
      <ScrollShadowTop visible={isTopShadowVisible} />
      <ScrollShadowBottom visible={isBottomShadowVisible} />
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'overflow-y-auto relative border border-transparent',
          hideScrollBar &&
            // '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
            '[&::-webkit-scrollbar]:hidden',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});
ScrollShadow.displayName = 'ScrollShadow';

const ScrollShadowTop = ({ visible }: { visible: boolean }) => (
  <div
    className={cn(
      'absolute z-10 top-0 left-0 right-0 h-20',
      visible
        ? 'block bg-gradient-to-t from-transparent to-background'
        : 'hidden'
    )}
  />
);

const ScrollShadowBottom = ({ visible }: { visible: boolean }) => (
  <div
    className={cn(
      'absolute z-10 bottom-0 left-0 right-0 h-20',
      visible
        ? 'block bg-gradient-to-b from-transparent to-background'
        : 'hidden'
    )}
  />
);

export { ScrollShadow, ScrollShadowTop, ScrollShadowBottom };
