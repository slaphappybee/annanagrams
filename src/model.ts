export class Position {
    row: number;
    column: number;
}

export class Tile {
    position: Position;
    label: string;
    ui?: boolean;
}
