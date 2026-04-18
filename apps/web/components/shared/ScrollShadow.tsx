'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { ScrollBar } from '@web/components/ui/scroll-area';
import { cn } from '@web/lib/utils';
import {
  type ComponentProps,
  type CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

type ScrollShadowProps = ComponentProps<'div'> & {
  orientation?: 'vertical' | 'horizontal';
  hideScrollBar?: boolean;
  size?: number;
};

const getMaskImage = ({
  orientation,
  showStartShadow,
  showEndShadow,
}: {
  orientation: 'vertical' | 'horizontal';
  showStartShadow: boolean;
  showEndShadow: boolean;
}) => {
  if (!showStartShadow && !showEndShadow) {
    return undefined;
  }

  if (orientation === 'horizontal') {
    if (showStartShadow && showEndShadow) {
      return 'linear-gradient(to right, transparent 0, black var(--scroll-shadow-size), black calc(100% - var(--scroll-shadow-size)), transparent 100%)';
    }

    if (showStartShadow) {
      return 'linear-gradient(to right, transparent 0, black var(--scroll-shadow-size), black 100%)';
    }

    return 'linear-gradient(to right, black 0, black calc(100% - var(--scroll-shadow-size)), transparent 100%)';
  }

  if (showStartShadow && showEndShadow) {
    return 'linear-gradient(to bottom, transparent 0, black var(--scroll-shadow-size), black calc(100% - var(--scroll-shadow-size)), transparent 100%)';
  }

  if (showStartShadow) {
    return 'linear-gradient(to bottom, transparent 0, black var(--scroll-shadow-size), black 100%)';
  }

  return 'linear-gradient(to bottom, black 0, black calc(100% - var(--scroll-shadow-size)), transparent 100%)';
};

export const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(
  (
    {
      children,
      className,
      orientation = 'vertical',
      hideScrollBar = false,
      size = 40,
      style,
      ...props
    },
    ref,
  ) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [showStartShadow, setShowStartShadow] = useState(false);
    const [showEndShadow, setShowEndShadow] = useState(false);

    useImperativeHandle(ref, () => viewportRef.current as HTMLDivElement, []);

    useEffect(() => {
      const viewport = viewportRef.current;

      if (!viewport) return;

      const updateShadows = () => {
        if (orientation === 'horizontal') {
          const hasOverflow = viewport.scrollWidth > viewport.clientWidth + 1;

          setShowStartShadow(hasOverflow && viewport.scrollLeft > 0);
          setShowEndShadow(
            hasOverflow &&
              viewport.scrollLeft + viewport.clientWidth <
                viewport.scrollWidth - 1,
          );

          return;
        }

        const hasOverflow = viewport.scrollHeight > viewport.clientHeight + 1;

        setShowStartShadow(hasOverflow && viewport.scrollTop > 0);
        setShowEndShadow(
          hasOverflow &&
            viewport.scrollTop + viewport.clientHeight <
              viewport.scrollHeight - 1,
        );
      };

      updateShadows();
      viewport.addEventListener('scroll', updateShadows, { passive: true });

      const resizeObserver = new ResizeObserver(updateShadows);
      resizeObserver.observe(viewport);

      if (viewport.firstElementChild instanceof HTMLElement) {
        resizeObserver.observe(viewport.firstElementChild);
      }

      return () => {
        viewport.removeEventListener('scroll', updateShadows);
        resizeObserver.disconnect();
      };
    }, [children, orientation]);

    const maskImage = getMaskImage({
      orientation,
      showStartShadow,
      showEndShadow,
    });

    const viewportStyle = useMemo(
      () =>
        ({
          '--scroll-shadow-size': `${size}px`,
          ...style,
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }) as CSSProperties,
      [maskImage, size, style],
    );

    return (
      <ScrollAreaPrimitive.Root
        data-slot="scroll-shadow"
        className="relative overflow-hidden rounded-[inherit]"
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          data-slot="scroll-shadow-viewport"
          className={cn(
            'size-full rounded-[inherit] outline-none',
            orientation === 'vertical'
              ? 'overflow-x-hidden overflow-y-auto'
              : 'overflow-x-auto overflow-y-hidden',
            className,
          )}
          style={viewportStyle}
          {...props}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        {!hideScrollBar && <ScrollBar orientation={orientation} />}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);

ScrollShadow.displayName = 'ScrollShadow';
