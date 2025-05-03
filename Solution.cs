
using System.Linq;
using System.Collections.Generic;

public class SnakeGame
{
    private record Point(int row, int column){}

    private const string UP = "U";
    private const string DOWN = "D";
    private const string LEFT = "L";
    private const string RIGHT = "R";

    private static readonly int INVALID_MOVE = -1;
    private static readonly int MAX_BOARD_SIDE = (int)Math.Pow(10, 4);
    private static readonly long HASH_OFFSET_ROWS = MAX_BOARD_SIDE * MAX_BOARD_SIDE;

    private readonly int rows;
    private readonly int columns;

    private readonly int[][] food;
    private readonly LinkedList<long> snakeBody;
    private readonly HashSet<long> quickAccessSnakeBody;

    private int score;
    private int indexFood;

    public SnakeGame(int width, int height, int[][] food)
    {
        rows = height;
        columns = width;

        snakeBody = new LinkedList<long>();
        snakeBody.AddFirst(ConvertCoordinatesToHash(0, 0));

        quickAccessSnakeBody = new HashSet<long>();
        quickAccessSnakeBody.Add(ConvertCoordinatesToHash(0, 0));

        this.food = food;
    }

    public int Move(string direction)
    {
        Point next = GetNextPoint(ConvertHashToCoordinates(snakeBody.First()), direction);
        long nextHash = ConvertCoordinatesToHash(next.row, next.column);

        if (!IsInBoundary(next))
        {
            return INVALID_MOVE;
        }

        if (!NextPointHasFood(next))
        {
            quickAccessSnakeBody.Remove(snakeBody.Last());
            snakeBody.RemoveLast();
        }
        else
        {
            ++indexFood;
            ++score;
        }

        if (quickAccessSnakeBody.Contains(nextHash))
        {
            return INVALID_MOVE;
        }

        quickAccessSnakeBody.Add(nextHash);
        snakeBody.AddFirst(nextHash);

        return score;
    }

    private bool NextPointHasFood(Point point)
    {
        return indexFood < food.Length && point.row == food[indexFood][0] && point.column == food[indexFood][1];
    }

    private bool IsInBoundary(Point point)
    {
        return point.row >= 0 && point.row < rows && point.column >= 0 && point.column < columns;
    }

    private Point GetNextPoint(Point point, string direction)
    {
        switch (direction)
        {
            case UP:
                return new Point(point.row - 1, point.column);

            case DOWN:
                return new Point(point.row + 1, point.column);

            case LEFT:
                return new Point(point.row, point.column - 1);

            case RIGHT:
                return new Point(point.row, point.column + 1);

        }
        return new Point(INVALID_MOVE, INVALID_MOVE);
    }

    private long ConvertCoordinatesToHash(int row, int column)
    {
        return HASH_OFFSET_ROWS * row + column;
    }

    private Point ConvertHashToCoordinates(long hash)
    {
        int row = (int)(hash / HASH_OFFSET_ROWS);
        int column = (int)(hash % HASH_OFFSET_ROWS);
        return new Point(row, column);
    }
}
