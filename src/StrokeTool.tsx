import React from 'react';
import Tool, { strokeSize, strokeColor, ToolOption } from './enums/Tool';
import { Icon } from 'antd';
import styles from './StrokeTool.less'

interface Point {
  x: number,
  y: number,
}

export interface Stroke {
  tool: Tool,
  color: string,
  size: number,
  points: Point[],
}

export interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Stroke tool
let stroke: Stroke | null = null;

let points: Point[] = [];

const drawLine = (context: CanvasRenderingContext2D, item: Stroke, start: Point, { x, y } : Point) => {
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = item.size;
  context.strokeStyle = item.color;
  context.globalCompositeOperation = 'source-over';
  context.moveTo(start.x, start.y);

  const xc = (start.x + x) / 2;
  const yc = (start.y + y) / 2;
  context.quadraticCurveTo(xc, yc, x, y);

  context.closePath();
  context.stroke();
};

export const drawStroke = (stroke: Stroke, context: CanvasRenderingContext2D) => {
  const points = stroke.points.filter((_, index) => index % 2);
  if (points.length < 3) {
    return;
  };

  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = stroke.size;
  context.globalCompositeOperation = 'source-over';
  context.strokeStyle = stroke.color;

  // move to the first point
  context.moveTo(points[0].x, points[0].y);

  let i = 0;
  const j = points.length;
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  // curve through the last two points
  context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x,points[i + 1].y);

  context.stroke();
}

export function onStrokeMouseDown(x: number, y: number, toolOption: ToolOption) {
  stroke = {
    tool: Tool.Stroke,
    color: toolOption.strokeColor,
    size: toolOption.strokeSize,
    points: [{ x, y }]
  };
  return [stroke];
}

export function onStrokeMouseMove(x: number, y: number, context: CanvasRenderingContext2D) {
  if (!stroke) return [];

  const newPoint = { x, y };
  const start = stroke.points.slice(-1)[0];
  drawLine(context, stroke, start, newPoint);
  stroke.points.push(newPoint);
  points.push(newPoint);

  return [stroke];
}

export function onStrokeMouseUp(setCurrentTool: (tool: Tool) => void, handleCompleteOperation: (tool?: Tool, data?: Stroke, pos?: Position) => void) {
  if (!stroke) {
    return;
  };

  // click to back to select mode.
  if (stroke.points.length < 6) {
    setCurrentTool(Tool.Select);
    handleCompleteOperation();

    points = [];
    stroke = null;

    return;
  }

  const item = stroke;
  points = [];
  stroke = null;

  if (item) {
    let lineData = item;
    let pos = null;

    if (lineData.tool === Tool.Stroke) {
      let xMax = -Infinity, yMax = -Infinity, xMin = lineData.points[0].x, yMin = lineData.points[0].y;

      lineData.points.forEach((p) => {
        if (p.x > xMax) {
          xMax = p.x
        }
        if (p.x < xMin) {
          xMin = p.x
        }
        if (p.y > yMax) {
          yMax = p.y
        }
        if (p.y < yMin) {
          yMin = p.y
        }
      });

      pos = {
        x: xMin,
        y: yMin,
        w: xMax - xMin,
        h: yMax - yMin,
      };

      handleCompleteOperation(Tool.Stroke, lineData, pos);
    }
  }

  return [item];
}

export const useStrokeDropdown = (currentToolOption: ToolOption, setCurrentToolOption: (option: ToolOption) => void, setCurrentTool: (tool: Tool) => void) => {
  return (
    <div className={styles.strokeMenu}>
      <div className={styles.colorAndSize}>
        <div className={styles.strokeSelector}>
          {strokeSize.map(size => {
            return (
              <div
                key={size}
                onClick={(evt) => {
                  evt.stopPropagation();
                  setCurrentToolOption({ ...currentToolOption, strokeSize: size });
                  setCurrentTool(Tool.Stroke);
                }}
                style={{ width: size + 4, height: size + 4, background: size === currentToolOption.strokeSize ? '#666666' : '#EEEEEE' }}
              ></div>
            )
          })}
        </div>
        <div className={styles.split}></div>
        <div className={styles.palatte}>
          {strokeColor.map(color => {
            return <div className={styles.color} key={color} onClick={(evt) => {
              evt.stopPropagation();
              setCurrentToolOption({ ...currentToolOption, strokeColor: color });
              setCurrentTool(Tool.Stroke);
            }}>
              <div className={styles.fill} style={{ background: color }}></div>
              {currentToolOption.strokeColor === color ? <Icon type="check" style={color === '#ffffff' ? { color: '#979797' } : {}} /> : null}
            </div>
          })}
        </div>
      </div>
    </div>
  )
}