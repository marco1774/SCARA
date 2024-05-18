/**
 *
 * ScaraSimulation2d
 *
 */
import * as React from 'react';
import { MainContainer } from 'app/components/MainContainer';
import {
  canvasConfig,
  centerOriginAndFlipYAxis,
  drawCartesianPlane,
  drawAndMoveFirstArm,
  drawGCodePath,
  drawAndMoveSecondArm,
  XYToAngle,
  clearCanvas,
  effectorPoint,
} from './scaraUtils';
import { gcode } from './scaraUtils/gcodeProva';

interface Props {}

export function ScaraSimulation2d(props: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const OFFSET_ORIGIN_X = 0;
  const OFFSET_CARTESIAN_PLANE_AXIS_Y = 0;
  const OFFSET_EFFECTOR_X = 200; // da rendere dinamica
  const FIRST_ARM_LENGTH = 190;
  const SECOND_ARM_LENGTH = 150;
  const FOOTER_ROOM = 300;
  const TOTAL_ARMS_LENGTH = FIRST_ARM_LENGTH - 1 + (SECOND_ARM_LENGTH - 1);
  const CANVAS_BG_COLOR = '#afafaf';

  React.useEffect(() => {
    // canvas config
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.backgroundColor = CANVAS_BG_COLOR;
    const ctx = canvas.getContext('2d');
    if (canvas == null || ctx == null) return;
    let path = [] as { x: any; y: any }[];
    let x = 0;
    let y = 0;

    /*
     * sposta le coordinate dell'origine al centro del canvas
     * inverte direzione asse Y
     */
    centerOriginAndFlipYAxis(ctx, canvas, OFFSET_CARTESIAN_PLANE_AXIS_Y);

    function start(ctx, x, y) {
      // inverse kinematics solver
      const [tetha1, tetha2] = XYToAngle(
        x - OFFSET_EFFECTOR_X,
        y,
        FIRST_ARM_LENGTH,
        SECOND_ARM_LENGTH,
      );

      const ang = tetha1 * (Math.PI / 180); // gradi in radianti
      const FIRST_ARM_X = Math.sin(ang) * FIRST_ARM_LENGTH + OFFSET_ORIGIN_X;
      const FIRST_ARM_Y = Math.cos(ang) * FIRST_ARM_LENGTH;
      const ang1 = tetha2 * (Math.PI / 180);

      // Pulisce il canvas ad ogni frame
      clearCanvas(ctx, canvas);

      // Disegna il piano cartesiano
      drawCartesianPlane(ctx);

      // Disegna e muove il primo braccio
      drawAndMoveFirstArm(
        ctx,
        FIRST_ARM_X,
        FIRST_ARM_Y,
        OFFSET_ORIGIN_X,
        'red',
      );

      // Disegna e muove il secondo braccio
      const { secondArmEndX, secondArmEndY } = drawAndMoveSecondArm(
        ctx,
        ang,
        ang1,
        FIRST_ARM_X,
        FIRST_ARM_Y,
        SECOND_ARM_LENGTH,
      );

      // Disegna sul canvas
      drawGCodePath(ctx, path, secondArmEndX, secondArmEndY);

      // Individua il punto effector
      effectorPoint(ctx, x, y, OFFSET_EFFECTOR_X);
    }

    function animate() {
      if (x >= gcode.length) {
        path = [];
      } else {
        start(ctx, gcode[x][0] * 8 - 1100, gcode[x][1] * 8 - 1080);
        x++;
      }
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <MainContainer>
      <h1>simulation2d</h1>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </MainContainer>
  );
}
