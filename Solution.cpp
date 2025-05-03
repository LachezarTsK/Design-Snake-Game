
#include <deque>
#include <vector>
#include <string>
#include <string_view>
#include <unordered_set>
using namespace std;

class SnakeGame {

    struct Point {
        int row = 0;
        int column = 0;

        Point(int row, int column) : row{ row }, column{ column } {}
        Point() = default;
    };

    inline static const string UP = "U";
    inline static const string DOWN = "D";
    inline static const string LEFT = "L";
    inline static const string RIGHT = "R";

    static const int INVALID_MOVE = -1;
    static const int MAX_BOARD_SIDE = 10000;
    static const long long HASH_OFFSET_ROWS = MAX_BOARD_SIDE * MAX_BOARD_SIDE;

    int rows = 0;
    int columns = 0;

    unique_ptr<const vector<vector<int>>> food;
    deque<long long> snakeBody;
    unordered_set<long long> quickAccessSnakeBody;

    int score = 0;
    int indexFood = 0;

public:
    SnakeGame(int width, int height, const vector<vector<int>>& food) {
        rows = height;
        columns = width;

        snakeBody.push_back(convertCoordinatesToHash(0, 0));
        quickAccessSnakeBody.insert(convertCoordinatesToHash(0, 0));

        this->food = make_unique<vector<vector<int>>>(food);
    }

    int move(string direction) {
        Point next = getNextPoint(convertHashToCoordinates(snakeBody.front()), direction);
        long long nextHash = convertCoordinatesToHash(next.row, next.column);

        if (!isInBoundary(next)) {
            return INVALID_MOVE;
        }

        if (!nextPointHasFood(next)) {
            quickAccessSnakeBody.erase(snakeBody.back());
            snakeBody.pop_back();
        }
        else {
            ++indexFood;
            ++score;
        }

        if (quickAccessSnakeBody.contains(nextHash)) {
            return INVALID_MOVE;
        }

        quickAccessSnakeBody.insert(nextHash);
        snakeBody.push_front(nextHash);

        return score;
    }

private:
    bool nextPointHasFood(const Point& point) const {
        return indexFood < food->size()
                && point.row == food->data()[indexFood][0]
                && point.column == food->data()[indexFood][1];
    }

    bool isInBoundary(const Point& point) const {
            return point.row >= 0 && point.row < rows && point.column >= 0 &&
                    point.column < columns;
    }

    Point getNextPoint(const Point& point, string_view direction) const {
        if (direction == UP) {
            return Point(point.row - 1, point.column);
        }

        if (direction == DOWN) {
            return Point(point.row + 1, point.column);
        }
        if (direction == LEFT) {
            return Point(point.row, point.column - 1);
        }
        if (direction == RIGHT) {
            return Point(point.row, point.column + 1);
        }

        return Point(INVALID_MOVE, INVALID_MOVE);
    }

    long long convertCoordinatesToHash(int row, int column) const {
        return HASH_OFFSET_ROWS * row + column;
    }

    Point convertHashToCoordinates(long long hash) const {
        int row = (hash / HASH_OFFSET_ROWS);
        int column = (hash % HASH_OFFSET_ROWS);
        return Point(row, column);
    }
};
