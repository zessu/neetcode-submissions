const spiral = (nums: number[][] = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]) => {
  let res: number[] = [];
  while(nums.length) {
    // 1. attach front
    // res = [...res, ...nums.shift()!];
    res.push(...nums.shift()!);


    // 2. append last items
    if(nums.length) {
      for(let arr of nums) {
        if(arr.length) res.push(arr.pop()!);
      }
    }

    // 3. add from last array in reverse
    if(nums.length) {
      const last = nums.pop()!;
      res.push(...last.reverse()!);
    }

    // 4. copy first elements
    if(nums.length) {
      for(let count = nums.length - 1; count >= 0; count --) {
        if(nums[count].length) res.push(nums[count].shift()!);
      }
    }
  }

  console.log(res);
}


spiral();
