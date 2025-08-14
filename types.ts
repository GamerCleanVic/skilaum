
export interface Point {
  x: number;
  y: number;
}

export interface Direction extends Point {}

export enum GameState {
  INITIAL,
  PLAYING,
  PAUSED,
  GAME_OVER,
  EXIT_SCREEN,
}

export enum ObstacleState {
    SOLID,
    DETERIORATING
}

export enum ObstacleType {
    ROCK,
    BRICK
}

export interface Obstacle {
    id: number;
    position: Point;
    state: ObstacleState;
    type: ObstacleType;
    deteriorationTimestamp?: number;
}

export interface SoundConfig {
    effects: boolean;
    music: boolean;
}