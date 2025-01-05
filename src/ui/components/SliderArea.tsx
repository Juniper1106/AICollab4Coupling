import "@ui/components/SliderArea.scss"
import { SliderSingleProps } from "antd";
import SliderGroup from "./SliderGroup"

const contextRange: SliderSingleProps['marks'] = {
    0: '小',
    // 2: ' ',
    5: '大',
}

const frequencyRange: SliderSingleProps['marks'] = {
    0: '低',
    [-15]: '中',
    15: '高',
}

function SliderArea() {
    return (
    <div className="sliderContainer">
        <SliderGroup defaultValue={2} maxValue={5} minValue={0} label="上下文范围&emsp;" toolTipText="决定AI在生成内容时考虑的历史记录，范围越大，包含的历史记录越久远" marks={contextRange} />
        <SliderGroup defaultValue={0} maxValue={15} minValue={-15} label="主动对话频率" toolTipText="决定AI发起主动交流的频率，频率越高，主动交流越频繁" marks={frequencyRange} />
    </div>
    );
}

export default SliderArea;