## Overview

This application is a web-based drawing tool that allows users to create and manipulate drawings on a canvas. It includes various features such as different brush types, color swatches, and the ability to render LaTeX.

## Components

### CanvasElement

The `CanvasElement` component is responsible for rendering the canvas where users can draw. It takes the following props:

- `canvasRef`: A reference to the canvas element.
- `currentSwatch`: The current color selected.
- `currentSize`: The current brush size.
- `brush`: The current brush type.

### Toolbar

The `Toolbar` component provides the user interface for selecting different tools and settings for drawing. It takes the following props:

- `canvasRef`: A reference to the canvas element.
- `currentSwatch`: The current color selected.
- `setCurrentSwatch`: Function to update the current color.
- `currentSize`: The current brush size.
- `setCurrentSize`: Function to update the brush size.
- `setLoading`: Function to set the loading state.
- `setLatex`: Function to set the LaTeX string.
- `brush`: The current brush type.
- `setBrush`: Function to update the brush type.

### Info

The `Info` component displays information about the application.

### Toaster

The `Toaster` component is used to display toast notifications.

### Spinner

The `Spinner` component is used to display a loading spinner.

### Latex

The `Latex` component renders LaTeX on the canvas. It takes the following props:

- `canvasRef`: A reference to the canvas element.
- `latex`: The LaTeX string to render.

## State Management

The main state variables used in the `Home` component are:

- `canvasRef`: A reference to the canvas element.
- `currentSwatch`: The current color selected.
- `currentSize`: The current brush size.
- `brush`: The current brush type.
- `loading`: A boolean indicating whether the application is in a loading state.
- `latex`: The LaTeX string to render.

## Usage

To use the application, simply interact with the toolbar to select different tools and settings, and draw on the canvas. The LaTeX component allows you to render mathematical expressions on the canvas.
