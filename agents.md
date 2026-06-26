# Agent Instructions

This repository follows a strict structure for Data Structures & Algorithms solutions. Every problem directory must contain the following:

1.  **Submission files**: One or more `submission-X.js` files containing the code.
2.  **README.md**: A detailed problem description, including examples, constraints, topics, and common pitfalls. **Must include multiple solution approaches** (e.g., Brute Force, Sorting, Two Pointers, and the Optimal approach) to provide a comprehensive understanding.
3.  **SOLUTION.md**: A detailed explanation of the solution, including the code, approach, complexity analysis, and a walkthrough. **Must contrast the implemented approach with the alternatives mentioned in the README.**
4.  **visualization.html**: A self-contained HTML file that visually explains the algorithm. **Must follow the design standards in `design.md`.**

## Instructions for AI Agents

If you are an AI agent working on this repository, you must:

1.  **Scan for missing documentation**: Whenever you see new submission files or if you are asked to audit the repository, check if each problem directory in `Data Structures & Algorithms/` has a `README.md`, `SOLUTION.md`, and `visualization.html`.
2.  **Generate or Update documentation**:
    - If files are missing, generate them based on the latest submission.
    - **Crucially**, ensure that `README.md` discusses multiple approaches (e.g., "Brute Force", "Sorting", "Two Pointers", "Binary Search") and `SOLUTION.md` explains why the chosen approach was used over others.
3.  **Maintain formatting**: Use existing `README.md` and `SOLUTION.md` files (e.g., in `eating-bananas/`) as templates for the expected format and level of detail.
4.  **Be Thorough**: Do not just document the implemented solution. Provide context on alternative ways to solve the problem, their complexities, and trade-offs.
5.  **Verify accuracy**: Ensure the problem description and complexity analysis accurately reflect the implementation in the submission files.
6.  **Generate visualization.html**: Each problem directory must contain a `visualization.html` file that:
    - Follows the **pastel theme** and component styles defined in [`design.md`](./design.md)
    - Includes a problem overview section
    - Shows one or more approaches with CSS/SVG diagrams (arrays, linked lists, trees, etc.)
    - Displays a comparison table of approaches with time/space complexity
    - Contains a resources section with links to LeetCode, NeetCode, and related problems
    - Is fully self-contained (no external dependencies, all CSS in `<style>` tags)

### Template Reference
- `Data Structures & Algorithms/eating-bananas/README.md`
- `Data Structures & Algorithms/eating-bananas/SOLUTION.md`
- `Data Structures & Algorithms/eating-bananas/visualization.html`
- [`design.md`](./design.md) — Color palette, typography, layout, and component standards for all visualizations
