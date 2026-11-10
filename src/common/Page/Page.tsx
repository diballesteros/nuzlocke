interface PageProps {
  children: React.ReactNode;
  header: string;
}

// Pages are left through the page nav and the header's menu, so the title stands alone. It's the
// section's first child but not its last, so it keeps the heading's 1rem bottom margin
function Page({ children, header }: PageProps): React.JSX.Element {
  return (
    // flex is important because Semantic's reset sets `section { display: block }`
    <section className="flex! h-full flex-col flex-nowrap gap-(--spacing-2) px-(--spacing-4)">
      <h2 className="text-foreground">{header}</h2>
      {children}
    </section>
  );
}

export default Page;
