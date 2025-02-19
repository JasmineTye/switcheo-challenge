# Sum Implementation Methods

This repository contains three different implementations of a function that calculates the sum of numbers from 1 to n.

## Implementations

### 1. Loop Implementation
```go
func sum_to_n_a(n int) int {
    sum := 0
    for i := 1; i <= n; i++ {
        sum += i
    }
    return sum
}
```
**Time Complexity**: O(n) - The function performs n iterations.  
**Space Complexity**: O(1) - Only uses a single variable for the sum.  
**Pros**: Simple to understand and implement  
**Cons**: Linear time complexity makes it less efficient for large values of n

### 2. Arithmetic Formula Implementation
```go
func sum_to_n_b(n int) int {
    return (n * (n + 1)) / 2
}
```
**Time Complexity**: O(1) - Constant time regardless of input size  
**Space Complexity**: O(1) - Uses a fixed amount of memory  
**Pros**: Most efficient implementation, uses the mathematical formula for sum of arithmetic sequence  
**Cons**: May overflow for very large values of n due to multiplication

### 3. Recursive Implementation
```go
func sum_to_n_c(n int) int {
    if n == 0 {
        return 0
    }
    return n + sum_to_n_c(n-1)
}
```
**Time Complexity**: O(n) - Makes n recursive calls  
**Space Complexity**: O(n) - Uses call stack space proportional to n  
**Pros**: Elegant and mathematically intuitive  
**Cons**: Most resource-intensive due to stack overhead, risk of stack overflow for large n

## Usage

```go
func main() {
    n := 10
    fmt.Printf("Sum to %d using loop: %d\n", n, sum_to_n_a(n))
    fmt.Printf("Sum to %d using arithmetic formula: %d\n", n, sum_to_n_b(n))
    fmt.Printf("Sum to %d using recursion: %d\n", n, sum_to_n_c(n))
}
```

## Performance Comparison

1. **Arithmetic Formula (Best)**: 
   - Constant time complexity
   - Best choice for most use cases
   - Most memory efficient

2. **Loop Implementation (Good)**:
   - Linear time complexity
   - Good for small to medium values of n
   - Memory efficient

3. **Recursive Implementation (Educational)**:
   - Linear time complexity with additional overhead
   - Uses more memory due to call stack
   - Mainly useful for learning purposes

## Recommendations

- For production use, prefer the arithmetic formula implementation (sum_to_n_b)
- For educational purposes or when code readability is priority, the loop implementation (sum_to_n_a) is a good choice
- The recursive implementation (sum_to_n_c) is best suited for learning and understanding recursive problem-solving

## Notes

- All implementations assume non-negative integers as input
- For very large values of n, consider potential integer overflow
- The arithmetic formula implementation requires careful consideration of overflow in languages with fixed-size integers
