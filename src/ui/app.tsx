import "@ui/styles/main.scss";

import AIAvatar from "./components/AIAvatar";
import SliderArea from "./components/SliderArea";
import HistoryArea from "./components/HistoryArea";

function App() {
  return (
    <div className="homepage">
      <AIAvatar />
      <SliderArea />
      <HistoryArea />
    </div>
  );
}

export default App;
