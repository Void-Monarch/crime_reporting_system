# MiniMap Component

A React component that displays interactive mini maps using Leaflet for crime report locations.

## Features

- **Interactive Maps**: Displays report locations on OpenStreetMap tiles
- **Loading States**: Shows loading spinner while map initializes
- **Error Handling**: Gracefully handles invalid coordinates and network errors
- **Responsive Design**: Adapts to different screen sizes
- **Coordinate Validation**: Validates lat/lng values before rendering
- **Customizable**: Configurable height, zoom level, and popup title

## Usage

```tsx
import MiniMap from "@/components/custom/MiniMap";

<MiniMap
  latitude={latitude}
  longitude={longitude}
  title="Crime Report Location"
  height="200px"
  zoom={16}
/>;
```

## Props

- `latitude` (number): Latitude coordinate (-90 to 90)
- `longitude` (number): Longitude coordinate (-180 to 180)
- `height` (string, optional): CSS height value (default: "200px")
- `zoom` (number, optional): Map zoom level (default: 15)
- `title` (string, optional): Popup title text (default: "Location")

## Integration

The MiniMap component is integrated into:

- Report detail views (read-only display)
- Report editing forms (live preview)
- Shows when coordinates are available
- Falls back to "No coordinates" message when data is missing

## Dependencies

- Leaflet 1.9.4+ for mapping functionality
- OpenStreetMap tiles for base layer
- Next.js compatible with SSR considerations
