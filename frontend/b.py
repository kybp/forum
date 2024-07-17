def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))

def fibonacci(n, memo=None):
    if memo is None:
        memo = {}
    
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

print(fibonacci(10))

def fibonacci(n):
    if n <= 1:
        return n

    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr

print(fibonacci(10))  # Outputs: 55
