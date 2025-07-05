// Very naive HTML sanitizer. Not production-ready!
// It removes <script>, <style> tags, event handler attributes (on*) and
// allows only a small whitelist of safe tags and attributes.

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  const ALLOWED_TAGS = new Set([
    'b',
    'i',
    'u',
    'em',
    'strong',
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'span',
    'div',
    'a',
    'img',
  ]);

  const ALLOWED_ATTRS: Record<string, Set<string>> = {
    a: new Set(['href', 'title', 'target', 'rel']),
    img: new Set(['src', 'alt', 'title', 'width', 'height']),
    default: new Set(['style']),
  } as any;

  const walk = (node: Element) => {
    // Remove disallowed tags completely
    if (!ALLOWED_TAGS.has(node.tagName.toLowerCase())) {
      node.replaceWith(...Array.from(node.childNodes));
      return;
    }

    // Remove dangerous attributes
    [...node.attributes].forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      // Remove any on* handler or javascript: uri
      if (
        attrName.startsWith('on') ||
        /javascript:/i.test(attr.value)
      ) {
        node.removeAttribute(attr.name);
        return;
      }
      const tagAllowed = ALLOWED_ATTRS[node.tagName.toLowerCase()] || ALLOWED_ATTRS.default;
      if (!tagAllowed.has(attrName)) {
        node.removeAttribute(attr.name);
      }
    });

    // Recurse children
    Array.from(node.children).forEach((child) => walk(child as Element));
  };

  Array.from(doc.body.children).forEach((child) => walk(child as Element));
  return doc.body.innerHTML;
} 