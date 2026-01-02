'use client';

// Next.js navigation compatibility layer
export { useRouter, usePathname, useSearchParams } from 'next/navigation';
export { default as Link } from 'next/link';

// Adapter for useNavigate (React Router) to Next.js router
import { useRouter as useNextRouter } from 'next/navigation';

export function useNavigate() {
  const router = useNextRouter();
  
  return (path, options = {}) => {
    if (typeof path === 'string') {
      if (options.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    } else if (typeof path === 'number') {
      if (path === -1) router.back();
      else if (path === 1) router.forward();
    }
  };
}

// Adapter for useParams
import { useParams as useNextParams } from 'next/navigation';

export function useParams() {
  return useNextParams();
}

// Adapter for useLocation
import { usePathname as useNextPathname, useSearchParams as useNextSearchParams } from 'next/navigation';

export function useLocation() {
  const pathname = useNextPathname();
  const searchParams = useNextSearchParams();
  
  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null,
  };
}
