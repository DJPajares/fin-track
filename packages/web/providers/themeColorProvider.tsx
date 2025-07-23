'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeColorProvider() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Function to update theme color meta tags
    const updateThemeColor = () => {
      const currentTheme = resolvedTheme || theme;
      const themeColor = currentTheme === 'dark' ? '#0c0c11' : '#ffffff';

      // Update the theme-color meta tag
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', themeColor);

      // Update msapplication-TileColor for Windows
      let metaTileColor = document.querySelector(
        'meta[name="msapplication-TileColor"]',
      );
      if (!metaTileColor) {
        metaTileColor = document.createElement('meta');
        metaTileColor.setAttribute('name', 'msapplication-TileColor');
        document.head.appendChild(metaTileColor);
      }
      metaTileColor.setAttribute('content', themeColor);

      // Update Apple mobile web app status bar style
      let metaAppleStatusBar = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]',
      );
      if (!metaAppleStatusBar) {
        metaAppleStatusBar = document.createElement('meta');
        metaAppleStatusBar.setAttribute(
          'name',
          'apple-mobile-web-app-status-bar-style',
        );
        document.head.appendChild(metaAppleStatusBar);
      }
      metaAppleStatusBar.setAttribute(
        'content',
        currentTheme === 'dark' ? 'black-translucent' : 'default',
      );
    };

    // Update theme color when component mounts or theme changes
    updateThemeColor();

    // Watch for theme changes by observing the html element's class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateThemeColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [theme, resolvedTheme]);

  // This provider doesn't render anything
  return null;
}
