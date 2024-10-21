import { useState } from "react";
import "@ui/components/SliderArea.scss"
import { Slider } from "antd";

function SliderArea() {
    const [disabled, setDisabled] = useState(false);

    return (
    <div className="sliderContainer">
        <Slider defaultValue={30} disabled={disabled} />
        <Slider defaultValue={30} disabled={disabled} />
    </div>
    );
}

export default SliderArea;