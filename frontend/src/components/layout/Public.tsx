import Image from "next/image";

interface RootLayoutProps {
  children: React.ReactNode;
}
const RootLayout = ({ children }: RootLayoutProps) => (
  <div className="flex flex-col lg:h-screen lg:flex-row">
    <main className="flex h-screen flex-col items-center justify-center p-8 lg:h-full lg:w-1/2 relative">
      {children}
    </main>
    <div className="lg:w-1/2 bg-primary-dark">
      <Image
        src="/landing.svg"
        className="h-full w-full object-cover"
        alt="landing"
      />
    </div>
    <footer className="absolute flex gap-x-4 bottom-0 left-0 m-2">
      <a
        rel="noreferrer"
        target="_blank"
        href="https://www.linkedin.com/in/wilson-sie-6a3485155/"
      >
        <Image alt="linkedIn" src="/linkedIn.svg" width={24} />
      </a>
    </footer>
  </div>
);
export default RootLayout;
