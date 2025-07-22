import { useRef } from "react";
import Softphone from "./components/SoftPhone";

function App() {
  const softphoneRef = useRef<HTMLDivElement | null | any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <Softphone ref={softphoneRef} />
      </div>
    </div>
  );
}

export default App;
