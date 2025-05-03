
package main
import "math"

const UP string = "U"
const DOWN string = "D"
const LEFT string = "L"
const RIGHT string = "R"

const INVALID_MOVE = -1

var MAX_BOARD_SIDE = math.Pow(10, 4)
var HASH_OFFSET_ROWS int64 = int64(MAX_BOARD_SIDE) * int64(MAX_BOARD_SIDE)

type Point struct {
    row    int
    column int
}

func NewPoint(row int, column int) *Point {
    point := &Point{
        row:    row,
        column: column,
    }
    return point
}

type SnakeGame struct {
    rows                 int
    columns              int
    snakeBody            []int64
    quickAccessSnakeBody HashSet
    score                int
    indexFood            int
    food                 [][]int
}

func Constructor(width int, height int, food [][]int) SnakeGame {
    snakeGame := SnakeGame{
        rows:                 height,
        columns:              width,
        snakeBody:            make([]int64, 0),
        quickAccessSnakeBody: NewHashSet(),
        score:                0,
        indexFood:            0,
        food:                 food,
    }
    snakeGame.snakeBody = append(snakeGame.snakeBody, convertCoordinatesToHash(0, 0))
    snakeGame.quickAccessSnakeBody.Add(convertCoordinatesToHash(0, 0))

    return snakeGame
}

func (this *SnakeGame) nextPointHasFood(point *Point) bool {
    return this.indexFood < len(this.food) &&
            point.row == this.food[this.indexFood][0] &&
            point.column == this.food[this.indexFood][1]
}

func (this *SnakeGame) isInBoundary(point *Point) bool {
    return point.row >= 0 && point.row < this.rows && point.column >= 0 && point.column < this.columns
}

func getNextPoint(point *Point, direction string) *Point {
    switch direction {
    case UP:
        return NewPoint(point.row - 1, point.column)
    case DOWN:
        return NewPoint(point.row + 1, point.column)
    case LEFT:
        return NewPoint(point.row, point.column - 1)
    case RIGHT:
        return NewPoint(point.row, point.column + 1)
    }
    return NewPoint(INVALID_MOVE, INVALID_MOVE)
}

func convertCoordinatesToHash(row int, column int) int64 {
    return HASH_OFFSET_ROWS * int64(row) + int64(column)
}

func convertHashToCoordinates(hash int64) *Point {
    row := int(hash / HASH_OFFSET_ROWS)
    column := int(hash % HASH_OFFSET_ROWS)
    return NewPoint(row, column)
}

func (this *SnakeGame) Move(direction string) int {
    var next *Point = getNextPoint(convertHashToCoordinates(this.snakeBody[0]), direction)
    var nextHash int64 = convertCoordinatesToHash(next.row, next.column)

    if !this.isInBoundary(next) {
        return INVALID_MOVE
    }

    if !this.nextPointHasFood(next) {
        this.quickAccessSnakeBody.Remove(this.snakeBody[len(this.snakeBody) - 1])
        this.snakeBody = this.snakeBody[:len(this.snakeBody) - 1]
    } else {
        this.indexFood++
        this.score++
    }

    if this.quickAccessSnakeBody.Contains(nextHash) {
        return INVALID_MOVE
    }

    this.quickAccessSnakeBody.Add(nextHash)
    this.snakeBody = append([]int64{nextHash}, this.snakeBody...)

    return this.score
}

type HashSet struct {
    conainer map[int64]bool
}

func NewHashSet() HashSet {
    return HashSet{conainer: map[int64]bool{}}
}

func (this HashSet) Contains(value int64) bool {
    return this.conainer[value]
}

func (this HashSet) Add(value int64) {
    this.conainer[value] = true
}

func (this HashSet) Remove(value int64) {
    delete(this.conainer, value)
}
