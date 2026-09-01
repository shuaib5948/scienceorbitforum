import type { ReactNode } from 'react';

export type Ratio = '4/3' | '16/9' | '3/4';

export interface ImageFrameProps {
  src: string;
  alt: string;
  ratio?: Ratio;
  overlay?: boolean;
  caption?: ReactNode;
  className?: string;
}

/**
 * Standard image container with optional hover zoom, ratio control and a
 * uniform bottom gradient. All editorial photography passes through this
 * frame so image treatment stays consistent site-wide.
 */
export function ImageFrame({
  src,
  alt,
  ratio = '4/3',
  overlay = false,
  caption,
  className = '',
}: ImageFrameProps) {
  const ratioClass =
    ratio === '16/9' ? 'image-frame--ratio-wide' : ratio === '3/4' ? 'image-frame--ratio-portrait' : 'image-frame--ratio';

  return (
    <figure className={`image-frame ${ratioClass} ${className}`.trim()}>
      <img className="image-frame__media" src={src} alt={alt} loading="lazy" />
      {overlay && <div className="image-frame__overlay" aria-hidden />}
      {caption && <figcaption className="image-frame__caption">{caption}</figcaption>}
    </figure>
  );
}