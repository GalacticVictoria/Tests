import { registerStart } from "./Yuu API/RegisterStart";
import { Events } from "./Yuu API/Events";
import { Color } from "./Yuu API/Basic Types/Color";
import { SkyDome } from "./Yuu API/SkyDome";

registerStart(start);

function start() {
  let elapsed = 0;

  // initial sky setup
  updateSky(0);

  Events.onUpdate((deltaTime: number) => {
    elapsed += deltaTime;

    // loop every 12 seconds
    const loopDuration = 12;
    const t = (elapsed % loopDuration) / loopDuration;

    // animate between day and sunset
    const topColor = Color.fromHSV(0.58 - 0.08 * Math.sin(Math.PI * t), 0.55, 1.0);
    const topHorizon = Color.fromHSV(0.55 - 0.1 * Math.sin(Math.PI * t), 0.65, 1.0);
    const bottomColor = Color.fromHSV(0.08 + 0.05 * Math.sin(Math.PI * t), 0.95, 0.95);
    const bottomHorizon = Color.fromHSV(0.12 + 0.1 * Math.sin(Math.PI * t), 0.95, 0.95);

    SkyDome.ambientLight.baseColor.set(new Color(0.18 + 0.12 * Math.sin(Math.PI * t), 0.22 + 0.16 * Math.sin(Math.PI * t), 0.32 + 0.08 * Math.sin(Math.PI * t)));
    SkyDome.ambientLight.energy.set(0.75 + 0.25 * Math.cos(Math.PI * t));
    SkyDome.ambientLight.skyColorContribution.set(0.4 + 0.35 * Math.sin(Math.PI * t));

    SkyDome.skyMaterial.setProceduralSkyMaterial(
      topColor,
      topHorizon,
      4,
      bottomColor,
      bottomHorizon,
      6
    );
  });
}

function updateSky(t: number) {
  const topColor = Color.fromHSV(0.58 - 0.08 * Math.sin(Math.PI * t), 0.55, 1.0);
  const topHorizon = Color.fromHSV(0.55 - 0.1 * Math.sin(Math.PI * t), 0.65, 1.0);
  const bottomColor = Color.fromHSV(0.08 + 0.05 * Math.sin(Math.PI * t), 0.95, 0.95);
  const bottomHorizon = Color.fromHSV(0.12 + 0.1 * Math.sin(Math.PI * t), 0.95, 0.95);

  SkyDome.ambientLight.baseColor.set(new Color(0.18 + 0.12 * Math.sin(Math.PI * t), 0.22 + 0.16 * Math.sin(Math.PI * t), 0.32 + 0.08 * Math.sin(Math.PI * t)));
  SkyDome.ambientLight.energy.set(0.75 + 0.25 * Math.cos(Math.PI * t));
  SkyDome.ambientLight.skyColorContribution.set(0.4 + 0.35 * Math.sin(Math.PI * t));

  SkyDome.skyMaterial.setProceduralSkyMaterial(
    topColor,
    topHorizon,
    4,
    bottomColor,
    bottomHorizon,
    6
  );
}
