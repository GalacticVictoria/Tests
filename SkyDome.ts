import { registerStart } from "./Yuu API/RegisterStart";
import { Color } from "./Yuu API/Basic Types/Color";
import { SkyDome } from "./Yuu API/SkyDome";

registerStart(start);

function start() {
  // Ambient light tint
  SkyDome.ambientLight.baseColor.set(new Color(1.0, 1.0, 1.0));
  SkyDome.ambientLight.energy.set(.01);
  SkyDome.ambientLight.skyColorContribution.set(0.0);

  // Procedural sky gradient
  SkyDome.skyMaterial.setProceduralSkyMaterial(
    new Color(1.0, 0.0, 0.0),  // top color
    new Color(1.0, 0.78, 0.0),  // top horizon color
    .01,                            // top curve
    new Color(1.0, 0.0, 0.0),     // bottom color
    new Color(1.0, 0.78, 0.0),   // bottom horizon color
    .01                             // bottom curve
  );

}