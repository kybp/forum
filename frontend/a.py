import heapq

def bidirectional_astar(grid, start, goal):
    # Define the heuristic function
    def heuristic(node, goal):
        return abs(node[0] - goal[0]) + abs(node[1] - goal[1])

    # Define the A* search function
    def astar_search(start, goal):
        open_list = []
        closed_list = set()
        came_from = {}
        cost_so_far = {start: 0}
        heapq.heappush(open_list, (0, start))

        while open_list:
            current_cost, current_node = heapq.heappop(open_list)

            if current_node == goal:
                break

            for neighbor in get_neighbors(grid, current_node):
                new_cost = cost_so_far[current_node] + 1
                if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                    cost_so_far[neighbor] = new_cost
                    priority = new_cost + heuristic(neighbor, goal)
                    heapq.heappush(open_list, (priority, neighbor))
                    came_from[neighbor] = current_node
                    closed_list.add(current_node)

        return came_from, cost_so_far

    # Define the function to get the neighbors of a node
    def get_neighbors(grid, node):
        neighbors = []
        for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            x, y = node[0] + dx, node[1] + dy
            if 0 <= x < len(grid) and 0 <= y < len(grid[0]) and grid[x][y] != 1:
                neighbors.append((x, y))
        return neighbors

    # Perform the bidirectional A* search
    came_from_start, cost_so_far_start = astar_search(start, goal)
    came_from_goal, cost_so_far_goal = astar_search(goal, start)

    # Find the meeting point
    meeting_point = None
    for node in came_from_start:
        if node in came_from_goal:
            meeting_point = node
            break

    # Reconstruct the path
    path = []
    current_node = meeting_point
    while current_node != start:
        path.append(current_node)
        current_node = came_from_start[current_node]
    path.append(start)
    path.reverse()
    current_node = meeting_point
    while current_node != goal:
        path.append(current_node)
        current_node = came_from_goal[current_node]
    path.append(goal)

    return path

# Example usage:
grid = [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0]
]
start = (0, 0)
goal = (4, 5)
path = bidirectional_astar(grid, start, goal)
print(path)
