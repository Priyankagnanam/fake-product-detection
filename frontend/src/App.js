import { useEffect, useState } from "react";
import { getProducts } from "./api";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getProducts().then(setData);
  }, []);

  return (
    <div>
      <h1>Fake Product Detection</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;