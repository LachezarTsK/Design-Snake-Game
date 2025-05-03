
// const {Queue} = require('@datastructures-js/queue');
/*
 Queue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

class Point {

    /**
     * @param {number} row
     * @param {number} column
     */
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

class SnakeGame {

    static #UP = "U";
    static #DOWN = "D";
    static #LEFT = "L";
    static #RIGHT = "R";

    static #INVALID_MOVE = -1;
    static #MAX_BOARD_SIDE = Math.pow(10, 4);
    static #HASH_OFFSET_ROWS = SnakeGame.#MAX_BOARD_SIDE * SnakeGame.#MAX_BOARD_SIDE;

    #rows;
    #columns;

    #food;
    #snakeBody;
    #quickAccessSnakeBody;

    #score;
    #indexFood;

    /**
     * @param {number} width
     * @param {number} height
     * @param {number[][]} food
     */
    constructor(width, height, food) {
        this.#rows = height;
        this.#columns = width;

        /*
         * The back of the Queue serves as the snake head.
         * The front of the Queue serves as the snake tail.
         */
        this.#snakeBody = new Queue();
        this.#snakeBody.enqueue(this.#convertCoordinatesToHash(0, 0));

        this.#quickAccessSnakeBody = new Set();
        this.#quickAccessSnakeBody.add(this.#convertCoordinatesToHash(0, 0));

        this.#score = 0;
        this.#indexFood = 0;

        this.#food = food;
    }

    /** 
     * @param {string} direction
     * @return {number}
     */
    move(direction) {
        const next = this.#getNextPoint(this.#convertHashToCoordinates(this.#snakeBody.back()), direction);
        const nextHash = this.#convertCoordinatesToHash(next.row, next.column);

        if (!this.#isInBoundary(next)) {
            return SnakeGame.#INVALID_MOVE;
        }

        if (!this.#nextPointHasFood(next)) {
            this.#quickAccessSnakeBody.delete(this.#snakeBody.front());
            this.#snakeBody.dequeue();
        } else {
            ++this.#indexFood;
            ++this.#score;
        }

        if (this.#quickAccessSnakeBody.has(nextHash)) {
            return  SnakeGame.#INVALID_MOVE;
        }

        this.#quickAccessSnakeBody.add(nextHash);
        this.#snakeBody.enqueue(nextHash);

        return this.#score;
    }

    /** 
     * @param {Point} point
     * @return {boolean}
     */
    #nextPointHasFood(point) {
        return this.#indexFood < this.#food.length
                && point.row === this.#food[this.#indexFood][0]
                && point.column === this.#food[this.#indexFood][1];
    }

    /** 
     * @param {Point} point
     * @return {boolean}
     */
    #isInBoundary(point) {
        return point.row >= 0 && point.row < this.#rows && point.column >= 0 && point.column < this.#columns;
    }

    /** 
     * @param {Point} point
     * @param {string} direction 
     * @return {Point}
     */
    #getNextPoint(point, direction) {
        switch (direction) {
            case SnakeGame.#UP:
                return new Point(point.row - 1, point.column);
            case SnakeGame.#DOWN:
                return new Point(point.row + 1, point.column);
            case SnakeGame.#LEFT:
                return new Point(point.row, point.column - 1);
            case SnakeGame.#RIGHT :
                return new Point(point.row, point.column + 1);
        }
        return new Point(SnakeGame.#INVALID_MOVE, SnakeGame.#INVALID_MOVE);
    }

    /** 
     * @param {number} row
     * @param {number} column 
     * @return {number}
     */
    #convertCoordinatesToHash(row, column) {
        return SnakeGame.#HASH_OFFSET_ROWS * row + column;
    }

    /** 
     * @param {number} hash
     * @return {Point}
     */
    #convertHashToCoordinates(hash) {
        const row = Math.floor(hash / SnakeGame.#HASH_OFFSET_ROWS);
        const column = (hash % SnakeGame.#HASH_OFFSET_ROWS);
        return new Point(row, column);
    }
}
