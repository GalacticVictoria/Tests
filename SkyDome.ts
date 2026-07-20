import { registerStart } from "./Yuu API/RegisterStart";
import { Color } from "./Yuu API/Basic Types/Color";
import { SkyDome } from "./Yuu API/SkyDome";

registerStart(start);

function start() {
  // Ambient light tint
  SkyDome.ambientLight.baseColor.set(new Color(1.0, 1.0, 1.0));
  SkyDome.ambientLight.energy.set(.1);
  SkyDome.ambientLight.skyColorContribution.set(0.6);

  // Procedural sky gradient
  SkyDome.skyMaterial.setProceduralSkyMaterial(
    new Color(0.0, 0.2, 1.0),  // top color
    new Color(0.0, 0.0, 0.0),  // top horizon color
    1,                            // top curve
    new Color(0.0, 0.0, 0.0),     // bottom color
    new Color(0.0, 1.0, 0.0),   // bottom horizon color
    3                             // bottom curve
  );

}