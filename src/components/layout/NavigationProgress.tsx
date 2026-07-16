'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);
  const active = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const start = useCallback(() => {
    if (active.current) return;
    active.current = true;
    clearTimers();
    setVisible(true);
    setShowOverlay(false);
    setProgress(15);
    timers.current.push(
      window.setTimeout(() => setProgress(45), 120),
      window.setTimeout(() => setProgress(70), 350),
      window.setTimeout(() => setProgress(85), 800),
      // Only show the full-page spinner if navigation takes a noticeable moment
      window.setTimeout(() => {
        if (active.current) setShowOverlay(true);
      }, 180),
    );
  }, [clearTimers]);

  const done = useCallback(() => {
    if (!active.current && progress === 0) return;
    clearTimers();
    setProgress(100);
    setShowOverlay(false);
    timers.current.push(
      window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        active.current = false;
      }, 220),
    );
  }, [clearTimers, progress]);

  // Finish when the route has actually changed
  useEffect(() => {
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to location changes
  }, [pathname, searchParams]);

  // Start on internal link clicks (covers soft navigations that skip loading.tsx)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      if (anchor.hasAttribute('download') || anchor.target === '_blank') return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const next = `${url.pathname}${url.search}`;
      const current = `${window.location.pathname}${window.location.search}`;
      if (next === current) return;

      start();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [start]);

  // Browser back/forward + programmatic router.push (via signalNavigationStart)
  useEffect(() => {
    const onPopState = () => start();
    const onProgrammatic = () => start();
    window.addEventListener('popstate', onPopState);
    window.addEventListener('sb:nav-start', onProgrammatic);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('sb:nav-start', onProgrammatic);
    };
  }, [start]);

  if (!visible && progress === 0) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden"
        role="progressbar"
        aria-hidden={!visible}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-[#2563eb] transition-[width,opacity] duration-200 ease-out"
          style={{
            width: `${progress}%`,
            opacity: visible ? 1 : 0,
          }}
        />
      </div>
      {showOverlay && (
        <div
          className="fixed inset-0 z-[99] flex items-center justify-center bg-surface/55 backdrop-blur-[1px]"
          role="status"
          aria-live="polite"
          aria-label="Loading page"
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-border bg-surface px-8 py-7 shadow-card">
            <Spinner size="lg" className="h-12 w-12" />
            <p className="text-sm font-medium text-ink-muted">Loading…</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
