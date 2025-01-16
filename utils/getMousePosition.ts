export const getMousePosition = (
  canvasDom: HTMLCanvasElement,
  mouseEvent: MouseEvent,
) => {
  const bounding = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - bounding.left,
    y: mouseEvent.clientY - bounding.top,
  };
};
