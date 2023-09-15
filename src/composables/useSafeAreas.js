export const useSafeAreas = () => {
  return {
    saTop: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--saTop'), 10),
    saRight: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--saRight'), 10),
    saBottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--saBottom'), 10),
    saLeft: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--saLeft'), 10)
  }
}
