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
          'relative overflow-y-auto border border-transparent',
          hideScrollBar &&
            // '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
            '[&::-webkit-scrollbar]:hidden',
          className,
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
      'absolute top-0 right-0 left-0 z-10 h-20',
      visible
        ? 'to-background block bg-linear-to-t from-transparent'
        : 'hidden',
    )}
  />
);

const ScrollShadowBottom = ({ visible }: { visible: boolean }) => (
  <div
    className={cn(
      'absolute right-0 bottom-0 left-0 z-10 h-20',
      visible
        ? 'to-background block bg-linear-to-b from-transparent'
        : 'hidden',
    )}
  />
);

export { ScrollShadow, ScrollShadowTop, ScrollShadowBottom };
