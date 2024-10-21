import "@ui/styles/main.scss";

import AIAvatar from "./components/AIAvatar";
import SliderArea from "./components/SliderArea";
import HistoryActions from "./components/HistoryActions";

function App() {
  return (
    <div className="homepage">
      <AIAvatar />
      <SliderArea />
      <HistoryActions />
    </div>
  );
}

export default App;
