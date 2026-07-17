/**
 * Renders a JSON-LD structured-data script. The payload is serialized once on
 * the server; it never contains user input, so injection into the script tag is
 * safe. Multiple <JsonLd> tags on one page are fine — search engines merge them.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
