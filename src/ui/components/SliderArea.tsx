import { useState } from "react";
import "@ui/components/SliderArea.scss"
import { Slider, Typography } from "antd";
import { InfoCircleTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import { SliderSingleProps } from "antd";

const { Text } = Typography;

const marks: SliderSingleProps['marks'] = {
    1: '小',
    2: '中',
    3: '大',
}

function SliderArea() {
    const [disabled, setDisabled] = useState(false);

    return (
    <div className="sliderContainer">
        <Text>AI视野范围 <InfoCircleOutlined style={{color: '#444444'}} /></Text>
        <Slider defaultValue={2} max={3} min={1} marks={marks} disabled={disabled} />

        <Text>AI记忆范围 <InfoCircleOutlined style={{color: '#444444'}} /></Text>
        <Slider defaultValue={2} max={3} min={1} marks={marks} disabled={disabled} />
    </div>
    );
}

export default SliderArea;