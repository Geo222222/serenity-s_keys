import { useEffect } from "react";

interface OpenGraphOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface MetadataOptions {
  title: string;
  description: string;
  openGraph?: OpenGraphOptions;
}

const ensureMetaTag = (selector: string, attribute: string, value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    if (selector.startsWith('meta[name="')) {
      const name = selector.match(/meta\[name="(.+)"\]/)?.[1];
      if (name) {
        element.setAttribute("name", name);
      }
    } else if (selector.startsWith('meta[property="')) {
      const property = selector.match(/meta\[property="(.+)"\]/)?.[1];
      if (property) {
        element.setAttribute("property", property);
      }
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

export const usePageMetadata = ({ title, description, openGraph }: MetadataOptions) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      ensureMetaTag('meta[name="title"]', "content", title);
      if (openGraph?.title) {
        ensureMetaTag('meta[property="og:title"]', "content", openGraph.title);
      }
    }

    if (description) {
      ensureMetaTag('meta[name="description"]', "content", description);
      if (openGraph?.description) {
        ensureMetaTag('meta[property="og:description"]', "content", openGraph.description);
      }
    }

    if (openGraph?.image) {
      ensureMetaTag('meta[property="og:image"]', "content", openGraph.image);
    }

    if (openGraph?.url) {
      ensureMetaTag('meta[property="og:url"]', "content", openGraph.url);
    }

    ensureMetaTag('meta[property="og:type"]', "content", openGraph?.url ? "website" : "article");
  }, [title, description, openGraph?.title, openGraph?.description, openGraph?.image, openGraph?.url]);
};
