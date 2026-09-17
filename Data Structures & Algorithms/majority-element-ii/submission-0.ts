
class Solution {
  /**
   * @param {number[]} nums
   * @return {number[]}
   */
  majorityElement(nums: number[]): number[] {
    const target = nums.length / 3;
    const map = new Map<number, number>();
    const result = new Set<number>();
    for (const [_, val] of nums.entries()) {
      map.set(val, (map.get(val) ?? 0) + 1);
      if (map.get(val) && map.get(val)! > target) {
        result.add(val);
      }
    }
    return [...result];
  }
}