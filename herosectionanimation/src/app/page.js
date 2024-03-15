import dynamic from 'next/dynamic';

const DynamicComponentWithDatGUI = dynamic(
 () => import("../displex-starter/src/app"),
 {
    ssr: false,
 }
);

const Index = () => {
 return (
    <>
      <div>
        <h1>Hello world!</h1>
        <DynamicComponentWithDatGUI />
      </div>
    </>
 );
};

export default Index;
