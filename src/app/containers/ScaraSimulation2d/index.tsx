/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * ScaraSimulation2d
 *
 */
import * as React from 'react';
import { MainContainer } from 'app/components/MainContainer';
import {
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
  let OFFSET_EFFECTOR_X = 268; // da rendere dinamica
  const FIRST_ARM_LENGTH = 190;
  const SECOND_ARM_LENGTH = 190;
  const FOOTER_ROOM = 300;
  const TOTAL_ARMS_LENGTH = FIRST_ARM_LENGTH - 1 + (SECOND_ARM_LENGTH - 1);
  const CANVAS_BG_COLOR = '#afafaf';
  const DRAW_GCODE_PATH_LINE_WIDTH = 1;

  // let gcode = [
  //   [1, 1],
  //   [200, 1],
  //   [200, 200],
  //   [1, 200],
  //   [1, 1],
  // ];

  React.useEffect(() => {
    // canvas config
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.backgroundColor = CANVAS_BG_COLOR;
    const ctx = canvas.getContext('2d');
    if (canvas == null || ctx == null) return;
    let path = [] as { x: any; y: any; color: any }[];
    let x = 0;
    let y = 0;

    /*
     * sposta le coordinate dell'origine al centro del canvas
     * inverte direzione asse Y
     */
    centerOriginAndFlipYAxis(ctx, canvas, OFFSET_CARTESIAN_PLANE_AXIS_Y);

    function start(ctx, x, y, DRAW_GCODE_PATH_COLOR = 'purple') {
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

      // Aggiungi la posizione dell'effettore al percorso
      path.push({
        x: secondArmEndX,
        y: secondArmEndY,
        color: DRAW_GCODE_PATH_COLOR,
      });

      // Disegna sul canvas
      drawGCodePath(
        ctx,
        path,

        DRAW_GCODE_PATH_LINE_WIDTH,
      );

      // Individua il punto effector
      effectorPoint(ctx, x, y, OFFSET_EFFECTOR_X);
    }

    function maxWorkingArea(ctx, start, TOTAL_ARMS_LENGTH, OFFSET_X) {
      OFFSET_EFFECTOR_X = 0;
      // Disegna la semi circonferenza massima che il braccio può disegnare
      for (let alpha = 1; alpha < 181; alpha++) {
        start(
          ctx,
          Math.sin(-alpha * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
          Math.cos(-alpha * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
          'red',
        );
      }
      for (let alpha = 180; alpha > 1; alpha--) {
        start(
          ctx,
          Math.sin(alpha * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
          Math.cos(alpha * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
          'blue',
        );
      }
      // *************************************************************

      // Disegna l'area massima rettangolare inscritta nel cerchio
      start(ctx, Math.sin(-45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH, 1);
      start(
        ctx,
        Math.sin(-45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
        Math.cos(-45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
        'yellow',
      );
      start(
        ctx,
        Math.sin(45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
        Math.cos(45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
        'yellow',
      );
      start(
        ctx,
        Math.sin(45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
        0,
        'yellow',
      );

      start(
        ctx,
        Math.sin(-45 * (Math.PI / 180)) * TOTAL_ARMS_LENGTH,
        0,
        'yellow',
      );
      // **************************************************************
      OFFSET_EFFECTOR_X = OFFSET_X;
    }
    maxWorkingArea(ctx, start, TOTAL_ARMS_LENGTH, OFFSET_EFFECTOR_X);

    function animate() {
      if (x >= gcode.length) {
        path = [];
      } else {
        start(ctx, gcode[x][0], gcode[x][1], 'cyan');
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
