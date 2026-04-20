class Solution {
  calculateOtherProduct(nums, index) {
    // calculate product of other elements except this one
    let product = 1;
    for (const item in nums) {
      if (parseInt(item) !== index) {
        product *= nums[item];
      }
    }

    return product;
  }

  productExceptSelf(nums) {
    const res = [];
    let product = 1;
    for (const item in nums) {
      product *= nums[item];
    }

    for (const item in nums) {
      const denominator = nums[item];
      if (denominator === 0) {
        const ret = this.calculateOtherProduct(nums, parseInt(item));
        res.push(ret);
      } else {
        res.push(product / denominator);
      }
    }

    return res;
  }
}
