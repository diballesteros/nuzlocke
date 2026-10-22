import { Back } from 'common';

interface PageProps {
  children: React.ReactNode;
  header: string;
}

function Page({ children, header }: PageProps): React.JSX.Element {
  return (
    // flex is important because Semantic's reset sets `section { display: block }`
    <section className="flex! h-full flex-col flex-nowrap gap-(--spacing-2) px-(--spacing-4)">
      <div className="flex flex-row flex-nowrap justify-between text-foreground">
        <h2>{header}</h2> <Back />
      </div>
      {children}
    </section>
  );
}

export default Page;
