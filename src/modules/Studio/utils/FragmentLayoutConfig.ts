export interface ObjectConfig {
  x: number
  y: number
  width: number
  height: number
  borderRadius: number
  color?: string
}

export const FragmentLayoutConfig = ({
  layoutNumber,
}: {
  layoutNumber: number
}): ObjectConfig => {
  switch (layoutNumber) {
    case 1:
      return {
        x: 56,
        y: 32,
        width: 848,
        height: 477,
        borderRadius: 8,
        color: '#182E42',
      }
    case 2:
      return {
        x: 32,
        y: 90,
        width: 640,
        height: 360,
        borderRadius: 8,
      }
    case 3:
      return {
        x: 288,
        y: 90,
        width: 640,
        height: 360,
        borderRadius: 8,
      }
    case 4:
      return {
        x: 32,
        y: 45,
        width: 800,
        height: 450,
        borderRadius: 8,
      }
    case 5:
    case 6:
      return {
        x: 72,
        y: 41,
        width: 816,
        height: 459,
        borderRadius: 8,
      }
    case 7:
    case 8:
      return {
        x: 0,
        y: 0,
        width: 960,
        height: 540,
        borderRadius: 8,
      }
    default:
      return {
        x: 288,
        y: 90,
        width: 640,
        height: 360,
        borderRadius: 8,
      }
  }
}
