
/// <reference types="vite/client" />

// Declaration for the Spline Viewer custom element
declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
      className?: string;
      loading?: string;
      events?: string;
      noTitle?: boolean;
      noFooter?: boolean;
    };
  }
}
