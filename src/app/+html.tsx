import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Custom root HTML document for the static web export.
 *
 * This file only runs during the web build (see https://docs.expo.dev/router/reference/static-rendering/#root-html).
 * It wires up:
 * - PWA manifest + icons so the app is installable to the home screen
 * - viewport meta tuned for a fixed mobile-first layout
 * - critical CSS that renders the "phone frame" on desktop viewports and
 *   keeps the app pinned to a 390px-wide mobile layout at every breakpoint
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <title>Saved Receipts Prototype</title>
        <meta
          name="description"
          content="Clickable usability-testing prototype for the Saved Receipts flow."
        />

        {/* PWA: manifest + icons
            Paths are prefixed with the GitHub Pages project subpath
            (see experiments.baseUrl in app.json) since this is deployed to
            https://OksanaBilyk-designer.github.io/saved-receipts-prototype/ */}
        <link rel="manifest" href="/saved-receipts-prototype/manifest.json" />
        <link rel="icon" href="/saved-receipts-prototype/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/saved-receipts-prototype/apple-touch-icon.png" />
        <meta name="theme-color" content="#142641" />

        {/* iOS-specific "Add to Home Screen" support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Saved Receipts" />

        {/*
          Disables body scrolling on web, matching how a native screen behaves.
          This is the standard reset recommended for full-screen RN Web apps.
        */}
        <ScrollViewStyleReset />

        {/* Phone-frame layout: fixed 390px mobile width, centered on wider viewports */}
        <style dangerouslySetInnerHTML={{ __html: webAppShellCss }} />

        {/* Register the service worker so the app is installable (Chrome/Android
            "Install app") and launches offline. Scoped to the GitHub Pages
            subpath so it only controls this prototype. */}
        <script dangerouslySetInnerHTML={{ __html: serviceWorkerRegistration }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const serviceWorkerRegistration = `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/saved-receipts-prototype/service-worker.js', {
          scope: '/saved-receipts-prototype/',
        })
        .catch(function (err) {
          console.warn('Service worker registration failed:', err);
        });
    });
  }
`;

const webAppShellCss = `
  :root {
    --app-width: 390px;
    --app-height: 844px;
  }

  html, body, #root {
    height: 100%;
    background-color: #0b0f14;
  }

  body {
    margin: 0;
    overflow: hidden;
  }

  /*
   * Below the phone-frame breakpoint (narrow viewport = an actual phone),
   * the app fills the real device screen edge-to-edge, same as native.
   */
  @media (max-width: 820px) {
    #root {
      width: 100%;
      height: 100%;
    }
  }

  /*
   * Above the breakpoint (desktop / tablet browser), center the app inside
   * a fixed-size phone frame so the mobile-first layout stays correct and
   * is easy to demo without resizing the browser window.
   */
  @media (min-width: 821px) {
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 20%, #1b2838 0%, #0b0f14 70%);
    }

    #root {
      position: relative;
      width: var(--app-width);
      height: var(--app-height);
      max-height: 92vh;
      border-radius: 44px;
      overflow: hidden;
      box-shadow:
        0 0 0 10px #0f1621,
        0 0 0 12px #2a2f3a,
        0 30px 60px rgba(0, 0, 0, 0.55);
    }

    /* Simple notch to sell the "phone" framing without needing extra assets */
    #root::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 24px;
      background: #0f1621;
      border-radius: 0 0 16px 16px;
      z-index: 1000;
      pointer-events: none;
    }
  }
`;
