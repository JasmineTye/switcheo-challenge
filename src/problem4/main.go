package main

import (
	"fmt"
)

// Implementation 1: Using a Loop
func sum_to_n_a(n int) int {
	sum := 0
	for i := 1; i <= n; i++ {
		sum += i
	}
	return sum
}

// Implementation 2: Using the Arithmetic Formula
func sum_to_n_b(n int) int {
	return (n * (n + 1)) / 2
}

// Implementation 3: Using Recursion
func sum_to_n_c(n int) int {
	if n == 0 {
		return 0
	}
	return n + sum_to_n_c(n-1)
}

func main() {
	n := 10
	fmt.Printf("Sum to %d using loop: %d\n", n, sum_to_n_a(n))
	fmt.Printf("Sum to %d using arithmetic formula: %d\n", n, sum_to_n_b(n))
	fmt.Printf("Sum to %d using recursion: %d\n", n, sum_to_n_c(n))
}
