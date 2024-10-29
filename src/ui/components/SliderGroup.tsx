import { useState } from "react";
import "@ui/components/SliderGroup.scss"
import { Slider, Typography, Tooltip } from "antd";
import { InfoCircleTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import { SliderSingleProps } from "antd";

const { Text } = Typography;

interface SliderAreaProps {
    label: string;
    toolTipText: string;
    marks: SliderSingleProps['marks'];
}

function SliderArea({ label, toolTipText, marks }: SliderAreaProps) {
    const [disabled, setDisabled] = useState(false);

    return (
    <div className="sliderGroup">
        <Text>{label}
            <Tooltip title={toolTipText} placement="top">
                <InfoCircleOutlined style={{color: '#444444', marginLeft: '0.25em'}} />
            </Tooltip>
        </Text>
        <Slider defaultValue={2} max={5} min={1} marks={marks} disabled={disabled} />
    </div>
    );
}

export default SliderArea;