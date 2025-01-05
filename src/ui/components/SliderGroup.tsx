import { useState } from "react";
import "@ui/components/SliderGroup.scss"
import { Slider, Typography, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { SliderSingleProps } from "antd";

const { Text } = Typography;

interface SliderAreaProps {
    label: string;
    toolTipText: string;
    marks: SliderSingleProps['marks'];
    defaultValue: number;
    maxValue: number;
    minValue: number;
}

function SliderArea({ label, toolTipText, marks, defaultValue, maxValue, minValue }: SliderAreaProps) {
    const [disabled, setDisabled] = useState(false);

    return (
    <div className="sliderGroup">
        <Text>{label}
            <Tooltip title={toolTipText} placement="top">
                <InfoCircleOutlined style={{color: '#444444', marginLeft: '0.25em'}} />
            </Tooltip>
        </Text>
        <Slider 
            defaultValue={defaultValue}
            max={maxValue}
            min={minValue}
            marks={marks}
            disabled={disabled}
        />
    </div>
    );
}

export default SliderArea;