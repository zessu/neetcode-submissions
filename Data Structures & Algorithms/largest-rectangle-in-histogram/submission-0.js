class Solution {
  /**
   * @param {number[]} heights
   * @return {number}
   */
  largestRectangleArea(heights) {
    const areas = [];
    for (let i = 0; i < heights.length; i++) {
      let minHeight = heights[i];
      for (let j = i; j < heights.length; j++) {
        if (i === j) {
          areas.push(heights[i]);
          continue;
        }
        minHeight = Math.min(minHeight, heights[j]);
        areas.push((j - i + 1) * minHeight);
      }
    }

    areas.sort((a,b) => b-a);

    return areas[0];
  }
}