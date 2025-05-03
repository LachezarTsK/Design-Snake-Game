
// const {Queue} = require('@datastructures-js/queue');
/*
 Queue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

class Point {

    row: number;
    column: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
}

class SnakeGame {

    private static UP: string = "U";
    private static DOWN: string = "D";
    private static LEFT: string = "L";
    private static RIGHT: string = "R";

    private static INVALID_MOVE: number = -1;
    private static MAX_BOARD_SIDE: number = Math.pow(10, 4);
    private static HASH_OFFSET_ROWS: number = SnakeGame.MAX_BOARD_SIDE * SnakeGame.MAX_BOARD_SIDE;

    private rows: number;
    private columns: number;

    private food: number[][];
    private snakeBody: Queue<number>;
    private quickAccessSnakeBody: Set<number>;

    private score: number;
    private indexFood: number;

    /**
     * @param {number} width
     * @param {number} height
     * @param {number[][]} food
     */
    constructor(width: number, height: number, food: number[][]) {
        this.rows = height;
        this.columns = width;

        /*
         * The back of the Queue serves as the snake head.
         * The front of the Queue serves as the snake tail.
         */
        this.snakeBody = new Queue<number>();
        this.snakeBody.enqueue(this.convertCoordinatesToHash(0, 0));

        this.quickAccessSnakeBody = new Set<number>();
        this.quickAccessSnakeBody.add(this.convertCoordinatesToHash(0, 0));

        this.score = 0;
        this.indexFood = 0;

        this.food = food;
    }

    move(direction: string): number {
        const next = this.getNextPoint(this.convertHashToCoordinates(this.snakeBody.back()), direction);
        const nextHash = this.convertCoordinatesToHash(next.row, next.column);

        if (!this.isInBoundary(next)) {
            return SnakeGame.INVALID_MOVE;
        }

        if (!this.nextPointHasFood(next)) {
            this.quickAccessSnakeBody.delete(this.snakeBody.front());
            this.snakeBody.dequeue();
        } else {
            ++this.indexFood;
            ++this.score;
        }

        if (this.quickAccessSnakeBody.has(nextHash)) {
            return SnakeGame.INVALID_MOVE;
        }

        this.quickAccessSnakeBody.add(nextHash);
        this.snakeBody.enqueue(nextHash);

        return this.score;
    }

    private nextPointHasFood(point: Point): boolean {
        return this.indexFood < this.food.length
            && point.row === this.food[this.indexFood][0]
            && point.column === this.food[this.indexFood][1];
    }

    private isInBoundary(point: Point): boolean {
        return point.row >= 0 && point.row < this.rows && point.column >= 0 && point.column < this.columns;
    }

    private getNextPoint(point: Point, direction: string): Point {
        switch (direction) {
            case SnakeGame.UP:
                return new Point(point.row - 1, point.column);
            case SnakeGame.DOWN:
                return new Point(point.row + 1, point.column);
            case SnakeGame.LEFT:
                return new Point(point.row, point.column - 1);
            case SnakeGame.RIGHT:
                return new Point(point.row, point.column + 1);
        }
        return new Point(SnakeGame.INVALID_MOVE, SnakeGame.INVALID_MOVE);
    }

    private convertCoordinatesToHash(row: number, column: number): number {
        return SnakeGame.HASH_OFFSET_ROWS * row + column;
    }

    private convertHashToCoordinates(hash: number): Point {
        const row = Math.floor(hash / SnakeGame.HASH_OFFSET_ROWS);
        const column = (hash % SnakeGame.HASH_OFFSET_ROWS);
        return new Point(row, column);
    }
}
