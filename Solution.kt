
import kotlin.math.pow
import kotlin.collections.ArrayDeque

class SnakeGame(private val width: Int, private val height: Int, private val food: Array<IntArray>) {

    data class Point(val row: Int, val column: Int){}

    private companion object {
        const val UP: String = "U"
        const val DOWN: String = "D"
        const val LEFT: String = "L"
        const val RIGHT: String = "R"

        const val INVALID_MOVE = -1
        val MAX_BOARD_SIDE = (10.0).pow(4).toInt()
        val HASH_OFFSET_ROWS: Long = MAX_BOARD_SIDE * MAX_BOARD_SIDE.toLong()
    }

    private var rows = height
    private var columns = width

    private val snakeBody = ArrayDeque<Long>()
    private val quickAccessSnakeBody = HashSet<Long>()

    init {
        snakeBody.add(convertCoordinatesToHash(0, 0))
        quickAccessSnakeBody.add(convertCoordinatesToHash(0, 0))
    }

    private var score = 0
    private var indexFood = 0

    fun move(direction: String): Int {
        val next: Point = getNextPoint(convertHashToCoordinates(snakeBody.first()), direction)
        val nextHash: Long = convertCoordinatesToHash(next.row, next.column)

        if (!isInBoundary(next)) {
            return INVALID_MOVE
        }

        if (!nextPointHasFood(next)) {
            quickAccessSnakeBody.remove(snakeBody.last())
            snakeBody.removeLast()
        } else {
            ++indexFood
            ++score
        }

        if (quickAccessSnakeBody.contains(nextHash)) {
            return INVALID_MOVE
        }

        quickAccessSnakeBody.add(nextHash)
        snakeBody.addFirst(nextHash)

        return score
    }

    private fun nextPointHasFood(point: Point): Boolean {
        return indexFood < food.size && point.row == food[indexFood][0] && point.column == food[indexFood][1]
    }

    private fun isInBoundary(point: Point): Boolean {
        return point.row in 0..<rows && point.column in 0..<columns
    }

    private fun getNextPoint(point: Point, direction: String): Point {
        when (direction) {
            UP -> return Point(point.row - 1, point.column)
            DOWN -> return Point(point.row + 1, point.column)
            LEFT -> return Point(point.row, point.column - 1)
            RIGHT -> return Point(point.row, point.column + 1)
        }
        return Point(INVALID_MOVE, INVALID_MOVE)
    }

    private fun convertCoordinatesToHash(row: Int, column: Int): Long {
        return HASH_OFFSET_ROWS * row + column
    }

    private fun convertHashToCoordinates(hash: Long): Point {
        val row = (hash / HASH_OFFSET_ROWS).toInt()
        val column = (hash % HASH_OFFSET_ROWS).toInt()
        return Point(row, column)
    }
}
