import "@ui/styles/main.scss";

import AIAvatar from "./components/AIAvatar";
import SliderArea from "./components/SliderArea";
import HistoryActions from "./components/HistoryActions";
import ChatHistory from "./components/ChatHistory"
import InputBox from "./components/InputBox";

function App() {
  return (
    <div className="homepage">
      <AIAvatar />
      <SliderArea />
      <HistoryActions />
      <InputBox />
    </div>
  );
}

export default App;
