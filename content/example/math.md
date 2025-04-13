---
title: Notes
created: 2025-04-13
updated: 2025-04-13
---

# Notes

## LU Decomp

> **Idea:** Calculating many linear systems with same $A$ but different $b$:
$$

\begin{align*}

Ax_1 &= b_1 \\

Ax_2 &= b_2 \\

& \vdots \\ 

Ax_k &= b_k

\end{align*}

 $$

- May need permutation matrix $P$ (matrix just to swap rows)
- If factorization exists, $A$ can be decomposed to $L$ and $U$ s.t:

$$

\begin{align*}

A &= LU \\

A &= (E^{(1)})^{-1}(E^{(2)})^{-1} \dots (E^{(k)})^{-1}U

\end{align*}

$$
- **Important rule of thumb:** Keep current pivot and modify rows lower than it
	- Ex. $R_2 \leftarrow R_2 + 2R_1$ ($R_1$ is pivot), $R_3 \leftarrow R_3 - 4R_2$ ($R_2$ is pivot)
- $U$ is REF of $A$, so upper triangular
- $L$ is lower triangular, contains inverse elementary matrices
	- Elementary matrices $E$ are matrices that can be achieved through elementary row operations from identity matrix $I$
		- "Records" the row operations to go from $A \rightarrow U$
- **Reason:** If lots of linear systems $n$ that rely on same $A$ but different $x$ and $b$:
	- Suppose $n$ linear systems, and row reducing is $k$ row operations for $A$ to REF, then will run $nk$ total row operations
	- Would be costly to keep row reducing via Gaussian Elimination
	- Instead, can use LU decomp. in order to subtitute to solve
$$

\begin{align*}

(LU)x_1 &= b_1 \\

(LU)x_2 &= b_2 \\

& \vdots \\ 

(LU)x_k &= b_k

\end{align*}

$$

### Properties

1. $\text{rank}(A) = \text{rank}(U)$
	- Since $\text{rank}(A)$ is the number of pivots in REF, and $U$ is REF
2. For square matrix, $A \in \mathbb{R}^{n \times n}$, $\det(A) = \det(U)$
	- Use the fact that $\det(A) = \det(LU) = \det(L) \det(U)$
	- Then $\det(L)$ is 1 since $L$ is *lower unit triangular*
		- Diagonals are 1 and determinant of lower/upper/diagonal matrix is product of diagonals)

---

## Error Analysis

> **Idea:** For sytem $Ax=b$, how do errors in $b$ affect solution ($x$)?
>
> - Observe $b + \Delta b$ instead of $b$
> - How does $x$ change (observe $x + \Delta x$ instead of $x$)?

### Digression: Norms

Euclidean norm (usually used):

$$

||x||_2 = \sqrt{x_1^2 + x_2^2 + \dots x_n^2}

$$

**Generally ($p$ norm):**

$$

||x||_p = (\sum_{j = 1} |x_j|^p)^{\frac{1}{p}}

$$

- As $p \rightarrow \infty$, $||x||_\infty = \max{|x_i|}$

#### Properties of Norms

Function $f : \mathbb{R}^n \rightarrow \mathbb{R}$ is a norm iff:

1. $\forall x \in \mathbb{R}^n, ||x|| \geq 0$
2. $||x|| \iff x = 0$
3. $\forall c \in \mathbb{R}, \forall x \in \mathbb{R}^n, ||cx|| = |c|||x||$
4. $||x+y|| \leq ||x|| + ||y||$

#### Matrix Norms

1. Frobenius Norm

$$

||A||_F = (\sum_{j = 1}^n \sum_{i = 1}^m a_{i, j}^2)^{\frac{1}{2}}

$$
2. Operator Norm ("max stretch")

$$

\begin{align*}

||A|| &= \max_{x \neq 0} \frac{||Ax||}{||x||} = \max_{||z|| = 1}||Az|| \\

||A^{-1}|| &= \max_{x \neq 0}\frac{||A^{-1}x||}{||x||} = \frac{1}{\min_{||y|| = 1} ||Ay||}

\end{align*}

$$

**Special case if $A$ is a diagonal square matrix, denoted $D \in \mathbb{R}^{n \times n}$:**
$$

D = \begin{bmatrix}  
d1 & & & \\  
 & d2 & & \\

 & & \ddots & \\

 & & & d_n  
\end{bmatrix}

$$

Then:
- $||D||$ is the absolute value of the largest diagonal element, denoted $d_{max}$:

$$

||D|| = \max_i |d_i| = |d_{max}|

$$
- $||D^{-1}||$ is the reciprocal of the smallest diagonal element:
$$

||D^{-1}|| = \frac{1}{\min_{||y|| = 1} ||Dy||} = \left|\frac{1}{d_{min}}\right|

$$

### Relative Errors and Relation

Relative errors:

$$

\frac{\Delta x}{x}, \frac{\Delta b}{b}

$$

Related by inequality:
