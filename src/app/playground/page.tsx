export default async function PlaygroundPage({
  params,
  searchParams,
}: PageProps<"/playground">) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <main>
      <pre>
        {JSON.stringify(
          {
            params: resolvedParams,
            searchParams: resolvedSearchParams,
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}
