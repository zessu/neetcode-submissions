# Product of Array Except Self - Solution

## Solution Code (Prefix + Suffix)

```javascript
class Solution {
    productExceptSelf(nums) {
        const n = nums.length;
        const result = new Array(n).fill(1);
        
        // Calculate prefix products
        let prefix = 1;
        for (let i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Calculate suffix products
        let suffix = 1;
        for (let i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        
        return result;
    }
}
```

## Solution Code (Handling Zeros)

```javascript
class Solution {
    calculateOtherProduct(nums, index) {
        let product = 1;
        for (let i = 0; i < nums.length; i++) {
            if (i !== index) {
                product *= nums[i];
            }
        }
        return product;
    }

    productExceptSelf(nums) {
        const res = [];
        let product = 1;
        for (const num of nums) {
            product *= num;
        }

        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === 0) {
                res.push(this.calculateOtherProduct(nums, i));
            } else {
                res.push(product / nums[i]);
            }
        }
        return res;
    }
}
```

## Approach

**Key Idea**: For each index, multiply:
- Product of all elements to the LEFT × Product of all elements to the RIGHT

## Complexity

- **Time**: O(n)
- **Space**: O(1) extra (ignoring output array)

## Walkthrough

```
nums = [1, 2, 3, 4]

Prefix pass:
i=0: result[0]=1, prefix=1
i=1: result[1]=1, prefix=2
i=2: result[2]=2, prefix=6
i=3: result[3]=6, prefix=24

Suffix pass:
i=3: result[3]=6*1=6, suffix=4
i=2: result[2]=2*4=8, suffix=12
i=1: result[1]=1*12=12, suffix=24
i=0: result[0]=1*24=24, suffix=24

Output: [24, 12, 8, 6] ✓
```