/** Signal that a client-side route change is starting (for NavigationProgress). */
export function signalNavigationStart() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('sb:nav-start'));
}
