type JsonLdProps = {
  data: unknown;
};

export function JsonLd({ data }: JsonLdProps) {
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- Structured data is serialized and escaped.
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
