# React Drawing board

Browser drawing board created with canvas and React.

## Fork-specific instructions

The built files are commited in the repository. So if you change a file in the `src` folder, be sure to run `npm run build` so that that the corresponding file in the `lib` folder is changed as well.

## Preview

![preview](https://raw.githubusercontent.com/dilidili/react-drawing-board/master/preview.png)

## Features
**A browser-ready efficient drawing board.**

- Support for drawing strokes, shapes, texts and images.
- Built-in support for both redo and clear.
- Easily zoom or pan the board content.
- Ability to save screenshot.
- Ability to be used as a Pictionary board for long distance communication.
- Working for mobile users.

## Installation

### In NPM
React Drawing board uses a CMD so you can use it in NPM as well. `npm install` this package and
```js
const DrawingBoard = require('react-drawing-board');
```

## Basic Use
### Basic 

```tsx
<DrawingBoard />
```

### As A Pictionary

```tsx
const Demo: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);

  return (
    <DrawingBoard
      userId="user1" // identify for different players.
      operations={operations}
      onChange={(newOperation, afterOperation) => {
        console.log(`TODO: send ${newOperation}`);
        setOperations(afterOperation);
      }}
    />
  )
}
```

## Props
| Props    | Description                              | Type       | Default |
|-----------|------------------------------------------|------------|---------|
| userId(optional) | identify for operation source | string | uuid.v4() |
| locale(optional) | 'en-US', 'zh-CN', 'tr-TR' | string | navigator.language |
| operations(optional) | operations on drawing board | Operation[] | undefined |
| onChange(optional) | called when user draw some operations | (newOperaton: Operation, operationsAfter: Operation[]) => void | undefined |
| onSave(image) | called when user click save button for saving current view | (image: { canvas: HTMLCanvasElement, dataUrl: string }) => void | undefined |
| style(optional) | element style | CSSProperties | undefined |
| className(optional) | element classname | string | undefined |
| toolbarPlacement(optional) | the position of toolbar | 'top' or 'left' or 'right' | 'top' |
| viewMatrix(optional) | control the current perspective  | undefined |
| onViewMatrixChange(optional) | (viewMatrix: ViewMatrix) => void  | undefined |

## How to run on local SGLearner

1) Clone this repo anywhere in your computer
```bash
git clone https://github.com/projetoeureka/react-drawing-board.git
```

2) Install dependencies and publish locally via yalc

```bash
npm install
# If you don't have yalc installed globally yet
npm install -g yalc

# Publish this library to your local yalc store
yalc publish
```

3) Apply changes and push updates to yalc

```bash
# Make your modifications under the src/ folder of this repo
npm run build && yalc push
```

4) In SGLearner, link and run

```bash
# Only needed the first time you link the package
cd web && yalc add react-drawing-board && cd ..

# After each change in this library:
# - stop SGLearner if it is running and then run:
yarn && make run-web
```
