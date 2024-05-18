export function canvasConfig(canvasRef) {
  const canvas = canvasRef.current as HTMLCanvasElement;
  canvas.height = window.innerHeight / 2;
  canvas.width = window.innerWidth / 2;
  canvas.style.backgroundColor = '#afafaf';
  const ctx = canvas.getContext('2d');

  return {
    ctx,
    canvas,
  };
}

export function clearCanvas(ctx, canvas) {
  ctx.clearRect(
    -canvas.width,
    -canvas.height,
    canvas.width * 2,
    canvas.height * 2,
  );
}

export function centerOriginAndFlipYAxis(
  ctx,
  canvas,
  OFFSET_CARTESIAN_PLANE_AXIS_Y,
) {
  ctx.translate(
    canvas.width / 2,
    canvas.height / 2 + OFFSET_CARTESIAN_PLANE_AXIS_Y,
  ); // sposta origine da top/sx al centro
  ctx.scale(1, -1); // cambia orientamento asse y numeri positi verso alto
}

export function drawCartesianPlane(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-400, 0);
  ctx.lineTo(400, 0);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 400);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

export function drawAndMoveFirstArm(
  ctx,
  FIRST_ARM_X,
  FIRST_ARM_Y,
  OFFSET_ORIGIN_X,
  color,
) {
  ctx.beginPath(); // Start a new path
  ctx.moveTo(0 + OFFSET_ORIGIN_X, 0); // Origine Primo Braccio
  ctx.lineTo(FIRST_ARM_X, FIRST_ARM_Y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.stroke(); // Render the path
  ctx.closePath();
}

export function drawAndMoveSecondArm(
  ctx,
  angle1,
  angle2,
  firstArmEndX,
  firstArmEndY,
  SECOND_ARM_LENGTH,
): { secondArmEndX: number; secondArmEndY: number } {
  if (ctx == null) return { secondArmEndX: 0, secondArmEndY: 0 }; // context may be null

  // Disegna il secondo braccio (elbow)
  ctx.beginPath();
  ctx.moveTo(firstArmEndX, firstArmEndY);
  let secondArmEndX =
    firstArmEndX + Math.sin(angle1 + angle2) * SECOND_ARM_LENGTH;
  let secondArmEndY =
    firstArmEndY + Math.cos(angle1 + angle2) * SECOND_ARM_LENGTH;
  ctx.lineTo(secondArmEndX, secondArmEndY);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.stroke();
  return {
    secondArmEndX,
    secondArmEndY,
  };
}

export function drawGCodePath(ctx, path, secondArmEndX, secondArmEndY) {
  // Aggiungi la posizione dell'effettore al percorso
  path.push({ x: secondArmEndX, y: secondArmEndY });

  // Disegna il percorso
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.strokeStyle = 'purple';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function radians_to_degrees(radians) {
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply radians by 180 divided by pi to convert to degrees.
  return radians * (180 / pi);
}

export function XYToAngle(x, y, FIRST_ARM_LENGTH, SECOND_ARM_LENGTH) {
  let hypotenuse = Math.sqrt(x ** 2 + y ** 2);
  if (hypotenuse > FIRST_ARM_LENGTH + SECOND_ARM_LENGTH)
    throw 'Cannot reach {hypotenuse}; total arm length is {FIRST_ARM_LENGTH + SECOND_ARM_LENGTH}';
  let hypotenuse_angle = Math.asin(x / hypotenuse); // inverse sine (in radians) of a number
  let inner_angle = Math.acos(
    // inverse cosine (in radians) of a number
    (hypotenuse ** 2 + FIRST_ARM_LENGTH ** 2 - SECOND_ARM_LENGTH ** 2) /
      (2 * hypotenuse * FIRST_ARM_LENGTH),
  );
  let outer_angle = Math.acos(
    (FIRST_ARM_LENGTH ** 2 + SECOND_ARM_LENGTH ** 2 - hypotenuse ** 2) /
      (2 * FIRST_ARM_LENGTH * SECOND_ARM_LENGTH),
  );
  let shoulder_motor_angle = hypotenuse_angle - inner_angle;
  let elbow_motor_angle = Math.PI - outer_angle;

  return [
    radians_to_degrees(shoulder_motor_angle),
    radians_to_degrees(elbow_motor_angle),
  ];
}

export function effectorPoint(ctx, x, y, OFFSET_EFFECTOR_X) {
  if (ctx == null) return; // context may be null

  ctx.beginPath();
  ctx.arc(x - OFFSET_EFFECTOR_X, y, 1, 0, 2 * Math.PI);
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();
  ctx.closePath();
}
