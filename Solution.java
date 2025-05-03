
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashSet;

public class SnakeGame {

    private record Point(int row, int column){}

    private static final String UP = "U";
    private static final String DOWN = "D";
    private static final String LEFT = "L";
    private static final String RIGHT = "R";

    private static final int INVALID_MOVE = -1;
    private static final int MAX_BOARD_SIDE = (int) Math.pow(10, 4);
    private static final long HASH_OFFSET_ROWS = MAX_BOARD_SIDE * MAX_BOARD_SIDE;

    private final int rows;
    private final int columns;

    private final int[][] food;
    private final Deque<Long> snakeBody;
    private final HashSet<Long> quickAccessSnakeBody;

    private int score;
    private int indexFood;

    public SnakeGame(int width, int height, int[][] food) {
        rows = height;
        columns = width;

        snakeBody = new ArrayDeque<>();
        snakeBody.add(convertCoordinatesToHash(0, 0));

        quickAccessSnakeBody = new HashSet<>();
        quickAccessSnakeBody.add(convertCoordinatesToHash(0, 0));

        this.food = food;
    }

    public int move(String direction) {
        Point next = getNextPoint(convertHashToCoordinates(snakeBody.getFirst()), direction);
        long nextHash = convertCoordinatesToHash(next.row, next.column);

        if (!isInBoundary(next)) {
            return INVALID_MOVE;
        }

        if (!nextPointHasFood(next)) {
            quickAccessSnakeBody.remove(snakeBody.getLast());
            snakeBody.removeLast();
        } else {
            ++indexFood;
            ++score;
        }

        if (quickAccessSnakeBody.contains(nextHash)) {
            return INVALID_MOVE;
        }

        quickAccessSnakeBody.add(nextHash);
        snakeBody.addFirst(nextHash);

        return score;
    }

    private boolean nextPointHasFood(Point point) {
        return indexFood < food.length && point.row == food[indexFood][0] && point.column == food[indexFood][1];
    }

    private boolean isInBoundary(Point point) {
        return point.row >= 0 && point.row < rows && point.column >= 0 && point.column < columns;
    }

    private Point getNextPoint(Point point, String direction) {
        switch (direction) {
            case UP -> {
                return new Point(point.row - 1, point.column);
            }
            case DOWN -> {
                return new Point(point.row + 1, point.column);
            }
            case LEFT -> {
                return new Point(point.row, point.column - 1);
            }
            case RIGHT -> {
                return new Point(point.row, point.column + 1);
            }
        }
        return new Point(INVALID_MOVE, INVALID_MOVE);
    }

    private long convertCoordinatesToHash(int row, int column) {
        return HASH_OFFSET_ROWS * row + column;
    }

    private Point convertHashToCoordinates(long hash) {
        int row = (int) (hash / HASH_OFFSET_ROWS);
        int column = (int) (hash % HASH_OFFSET_ROWS);
        return new Point(row, column);
    }
}
