import "@ui/components/SliderArea.scss"
import { SliderSingleProps } from "antd";
import SliderGroup from "./SliderGroup"

const marksSmallLarge: SliderSingleProps['marks'] = {
    1: '小',
    // 2: ' ',
    5: '大',
}

const marksLowHigh: SliderSingleProps['marks'] = {
    1: '低',
    // 2: ' ',
    5: '高',
}

function SliderArea() {
    return (
    <div className="sliderContainer">
        <SliderGroup label="上下文范围&emsp;" toolTipText="待定的文字" marks={marksSmallLarge} />
        {/* <SliderGroup label="记忆更新频率" toolTipText="待定的文字" marks={marksLowHigh} /> */}
        <SliderGroup label="主动对话频率" toolTipText="待定的文字" marks={marksLowHigh} />
        {/* <SliderGroup label="内容放置位置" toolTipText="待定的文字" marks={marksLowHigh} /> */}
    </div>
    );
}

export default SliderArea;