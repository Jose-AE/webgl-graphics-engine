interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number; // Initial value of the slider
  onChange: (v: number) => void;
}

export function createSliders(sliderConfigs: SliderConfig[]) {
  // Get the container element where the sliders will be appended
  const container = document.getElementById("slider-container");

  if (container) {
    sliderConfigs.forEach((config, i) => {
      // Create the structure for each slider
      const controlGroup = document.createElement("div");
      controlGroup.classList.add("control-group");

      // Create the label for the slider
      const label = document.createElement("span");
      label.classList.add("control-label");
      label.textContent = config.label || `Component ${i + 1}`; // Use the provided label from the config

      // Create the slider container
      const sliderContainer = document.createElement("div");
      sliderContainer.classList.add("slider-container");

      // Create the slider element
      const slider = document.createElement("input");
      slider.type = "range";
      slider.id = `${config.label.toLowerCase().replace(/ /g, "")}Slider`; // Set the id dynamically, e.g., redSlider
      slider.min = config.min.toString();
      slider.max = config.max.toString();
      slider.step = config.step.toString();
      slider.value = config.value.toString(); // Initial value of the slider
      config.onChange(config.value);

      // Create the value display span
      const valueDisplay = document.createElement("span");
      valueDisplay.classList.add("value-display");
      valueDisplay.id = `${config.label.toLowerCase().replace(/ /g, "")}Value`; // Set the id dynamically, e.g., redValue
      valueDisplay.textContent = config.value.toFixed(2); // Initial value displayed with 2 decimal places

      // Append the slider and value display to the slider container
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(valueDisplay);

      // Append the label and slider container to the control group
      controlGroup.appendChild(label);
      controlGroup.appendChild(sliderContainer);

      // Append the control group to the main container
      container.appendChild(controlGroup);

      // Add input event listener to update the value display and slider value
      slider.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const value = parseFloat(target.value);

        // Update the value display
        const valueDisplay = document.getElementById(
          `${config.label.toLowerCase().replace(/ /g, "")}Value`
        ) as HTMLSpanElement;
        if (valueDisplay) {
          valueDisplay.textContent = value.toFixed(2); // Display with 2 decimal places
        }
        config.onChange(value);

        //console.log(value); // Output the current slider values to the console
      });
    });
  } else {
    console.error("Container element not found.");
  }
}
